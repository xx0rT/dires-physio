import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Eye, Search, Tag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  view_count: number;
  published_at: string | null;
  created_at: string;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readTime(excerpt: string) {
  const words = excerpt.split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 40));
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blogs")
        .select(
          "id, title, slug, excerpt, featured_image, tags, view_count, published_at, created_at"
        )
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setBlogs(data ?? []);
      setLoading(false);
    })();
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const b of blogs) b.tags?.forEach((t) => set.add(t));
    return Array.from(set).sort();
  }, [blogs]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q);
      const matchesTag = !activeTag || b.tags?.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [blogs, search, activeTag]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section className="pb-20">
      {/* Hero */}
      <div className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Blog
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-4xl lg:text-5xl">
              Novinky ze sveta fyzioterapie
            </h1>
            <p className="mt-3 max-w-xl text-base text-neutral-500 dark:text-neutral-400">
              Odborne clanky, rady a tipy od nasich certifikovanych
              fyzioterapeutu. Vzdelavejte se a pecujte o sve zdravi.
            </p>
          </motion.div>

          {/* Search + tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Hledat clanky..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTag(null)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  !activeTag
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                )}
              >
                Vse
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    activeTag === tag
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {loading ? (
          <BlogSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-lg font-medium text-neutral-500">
              Zadne clanky nebyly nalezeny
            </p>
            <p className="mt-1 text-sm text-neutral-400">
              Zkuste zmenit vyhledavani nebo filtr.
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {/* Featured post */}
            {featured && (
              <motion.div variants={item} className="mt-10">
                <FeaturedCard blog={featured} />
              </motion.div>
            )}

            <Separator className="my-10" />

            {/* Grid */}
            {rest.length > 0 && (
              <motion.div
                variants={container}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {rest.map((blog) => (
                  <motion.div key={blog.id} variants={item}>
                    <BlogCard blog={blog} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ blog }: { blog: Blog }) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <motion.article
        className="group grid gap-6 overflow-hidden rounded-2xl bg-neutral-50 dark:bg-neutral-900 lg:grid-cols-2"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25 }}
      >
        <div className="aspect-[16/10] overflow-hidden">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-neutral-200 dark:bg-neutral-800" />
          )}
        </div>
        <div className="flex flex-col justify-center p-6 lg:py-8 lg:pr-10 lg:pl-0">
          <div className="flex flex-wrap items-center gap-2">
            {blog.tags?.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-300 sm:text-2xl lg:text-3xl">
            {blog.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {blog.excerpt}
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {formatDate(blog.published_at || blog.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {readTime(blog.excerpt)} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {blog.view_count}
            </span>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 dark:text-white">
            Cist clanek
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </motion.article>
    </Link>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <motion.article
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="aspect-[16/10] overflow-hidden">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-neutral-100 dark:bg-neutral-800" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {blog.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
              >
                <Tag className="size-2.5" />
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-2.5 line-clamp-2 text-base font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-300">
            {blog.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {blog.excerpt}
          </p>
          <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formatDate(blog.published_at || blog.created_at)}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {readTime(blog.excerpt)} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="size-3" />
                {blog.view_count}
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function BlogSkeleton() {
  return (
    <div className="mt-10 space-y-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="aspect-[16/10] rounded-2xl" />
        <div className="space-y-4 py-6">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <Separator />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[16/10] rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
