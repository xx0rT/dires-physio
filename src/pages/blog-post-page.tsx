import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  Calendar,
  Clock,
  Eye,
  Share2,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: { html?: string; blocks?: unknown[] } | null;
  featured_image: string;
  tags: string[];
  view_count: number;
  published_at: string | null;
  created_at: string;
}

interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readTimeFromHtml(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 200));
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPost(data);
      setNotFound(false);

      await supabase
        .from("blogs")
        .update({ view_count: (data.view_count ?? 0) + 1 })
        .eq("id", data.id);

      const { data: relatedData } = await supabase
        .from("blogs")
        .select(
          "id, title, slug, excerpt, featured_image, tags, published_at, created_at"
        )
        .eq("status", "published")
        .neq("id", data.id)
        .order("published_at", { ascending: false })
        .limit(3);

      setRelated(relatedData ?? []);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <PostSkeleton />;

  if (notFound || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Clanek nenalezen
        </h1>
        <p className="mt-2 text-neutral-500">
          Tento clanek neexistuje nebo byl odstranen.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/blog">
            <ArrowLeft className="mr-2 size-4" />
            Zpet na blog
          </Link>
        </Button>
      </div>
    );
  }

  const htmlContent = post.content?.html ?? "";
  const readMin = readTimeFromHtml(htmlContent);

  return (
    <section className="pb-20">
      {/* Hero banner */}
      <div className="relative">
        {post.featured_image && (
          <div className="h-64 overflow-hidden sm:h-80 lg:h-96">
            <img
              src={post.featured_image}
              alt={post.title}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        )}
        {!post.featured_image && (
          <div className="h-32 bg-neutral-100 dark:bg-neutral-900" />
        )}
      </div>

      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={post.featured_image ? "-mt-20 relative z-10" : "mt-8"}
        >
          <Link
            to="/blog"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <ArrowLeft className="size-3" />
            Zpet na blog
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {post.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] font-medium"
              >
                <Tag className="mr-0.5 size-2.5" />
                {tag}
              </Badge>
            ))}
          </div>

          <h1
            className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl ${
              post.featured_image
                ? "text-white drop-shadow-md"
                : "text-neutral-900 dark:text-white"
            }`}
          >
            {post.title}
          </h1>

          <p
            className={`mt-2 text-sm leading-relaxed ${
              post.featured_image
                ? "text-neutral-200"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            {post.excerpt}
          </p>

          <div
            className={`mt-4 flex flex-wrap items-center gap-4 text-xs ${
              post.featured_image
                ? "text-neutral-300"
                : "text-neutral-400"
            }`}
          >
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {readMin} min cteni
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {post.view_count} zobrazeni
            </span>
          </div>
        </motion.div>

        <Separator className="my-8" />

        {/* Article body */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-xl prose-a:text-neutral-900 prose-a:underline-offset-2 dark:prose-a:text-white"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex items-center justify-between"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Share2 className="mr-1.5 size-3.5" />
            Sdilet
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ArrowUp className="mr-1.5 size-3.5" />
            Nahoru
          </Button>
        </motion.div>

        {/* Related posts */}
        {related.length > 0 && (
          <>
            <Separator className="my-10" />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            >
              <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                Dalsi clanky
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} to={`/blog/${r.slug}`}>
                    <motion.div
                      className="group overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                      whileHover={{ y: -3 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      {r.featured_image && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={r.featured_image}
                            alt={r.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 transition-colors group-hover:text-neutral-600 dark:text-white dark:group-hover:text-neutral-300">
                          {r.title}
                        </h3>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          {formatDate(r.published_at || r.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

function PostSkeleton() {
  return (
    <div className="pb-20">
      <Skeleton className="h-80 w-full" />
      <div className="container mx-auto max-w-3xl space-y-4 px-4 pt-8 sm:px-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Separator className="my-8" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
