import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  Search,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readTime(excerpt: string) {
  return Math.max(2, Math.ceil(excerpt.split(/\s+/).length / 40));
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
    <section className="pb-24">
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 pt-32 pb-14 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Badge variant="outline" className="mb-4 text-xs font-medium tracking-wide">
              Blog
            </Badge>
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Novinky ze sveta fyzioterapie
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              Odborne clanky, rady a tipy od nasich certifikovanych
              fyzioterapeutu. Vzdelavejte se a pecujte o sve zdravi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
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
                  "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
                  !activeTag
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                Vse
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setActiveTag(activeTag === tag ? null : tag)
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-all duration-200",
                    activeTag === tag
                      ? "bg-foreground text-background shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {loading ? (
          <BlogSkeleton />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              Zadne clanky nebyly nalezeny
            </p>
            <p className="mt-1 text-sm text-muted-foreground/70">
              Zkuste zmenit vyhledavani nebo filtr.
            </p>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible">
            {featured && (
              <motion.div variants={item} className="mt-12">
                <FeaturedCard blog={featured} />
              </motion.div>
            )}

            {rest.length > 0 && (
              <>
                <Separator className="my-12" />
                <motion.div
                  variants={container}
                  className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {rest.map((blog) => (
                    <motion.div key={blog.id} variants={item}>
                      <BlogCard blog={blog} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
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
        className="group grid overflow-hidden rounded-2xl border bg-card lg:grid-cols-5"
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="aspect-[16/10] overflow-hidden lg:col-span-3 lg:aspect-auto lg:h-full">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="size-full bg-muted" />
          )}
        </div>
        <div className="flex flex-col justify-center p-6 lg:col-span-2 lg:p-10">
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
          <h2 className="mt-4 text-xl font-bold tracking-tight transition-colors group-hover:text-muted-foreground sm:text-2xl lg:text-3xl">
            {blog.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Avatar className="size-7 border">
              <AvatarImage src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80" />
            </Avatar>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                Fyzioterapie tym
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(blog.published_at || blog.created_at)}
              </span>
            </div>
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
            Cist clanek
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
        className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="aspect-[16/10] overflow-hidden">
          {blog.featured_image ? (
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="size-full bg-muted" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-1.5">
            {blog.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                <Tag className="size-2.5" />
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-3 line-clamp-2 text-base font-semibold tracking-tight transition-colors group-hover:text-muted-foreground">
            {blog.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between pt-5">
            <div className="flex items-center gap-2">
              <Avatar className="size-6 border">
                <AvatarImage src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80" />
              </Avatar>
              <span className="text-[11px] font-medium">Fyzioterapie tym</span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Clock className="size-3" />
                {readTime(blog.excerpt)} min
              </span>
              <span className="flex items-center gap-0.5">
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
    <div className="mt-12 space-y-12">
      <div className="grid overflow-hidden rounded-2xl border lg:grid-cols-5">
        <Skeleton className="aspect-[16/10] lg:col-span-3 lg:aspect-auto lg:min-h-[360px]" />
        <div className="space-y-4 p-10 lg:col-span-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border p-0 overflow-hidden">
            <Skeleton className="aspect-[16/10] rounded-none" />
            <div className="space-y-2 p-5 pt-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
