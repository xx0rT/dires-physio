import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Eye,
  Facebook,
  Home,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

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
  published_at: string | null;
  created_at: string;
}

interface TocHeading {
  id: string;
  text: string;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readTimeFromHtml(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  return Math.max(2, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function extractHeadings(html: string): { headings: TocHeading[]; processedHtml: string } {
  const headings: TocHeading[] = [];
  const processedHtml = html.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    (_match, attrs, inner) => {
      const text = inner.replace(/<[^>]*>/g, "").trim();
      const id = slugify(text);
      headings.push({ id, text });
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    }
  );
  return { headings, processedHtml };
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

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
        .select("id, title, slug, excerpt, featured_image, published_at, created_at")
        .eq("status", "published")
        .neq("id", data.id)
        .order("published_at", { ascending: false })
        .limit(3);

      setRelated(relatedData ?? []);
      setLoading(false);
    })();
  }, [slug]);

  const { headings, processedHtml } = useMemo(() => {
    const raw = post?.content?.html ?? "";
    return extractHeadings(raw);
  }, [post]);

  const observeRef = useCallback(() => {
    const ids = Object.keys(sectionRefs.current);
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const el of Object.values(sectionRefs.current)) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!processedHtml || headings.length === 0) return;

    const timeout = setTimeout(() => {
      sectionRefs.current = {};
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el) sectionRefs.current[h.id] = el;
      }
      observeRef();
    }, 100);

    return () => clearTimeout(timeout);
  }, [processedHtml, headings, observeRef]);

  if (loading) return <PostSkeleton />;

  if (notFound || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-32 text-center">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
          Clanek nenalezen
        </h1>
        <p className="mt-2 text-muted-foreground">
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

  const readMin = readTimeFromHtml(processedHtml);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <section className="pt-28 pb-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">
                    <Home className="size-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-[200px]">
                  {post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-9 mb-7 max-w-3xl text-3xl font-bold tracking-tight md:mb-10 md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm md:text-base">
            <Avatar className="size-8 border">
              <AvatarImage src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=80" />
            </Avatar>
            <span>
              <span className="font-medium">Fyzioterapie tym</span>
              <span className="ml-1 text-muted-foreground">
                {formatDate(post.published_at || post.created_at)}
              </span>
            </span>
          </div>
        </motion.div>

        <div className="relative mt-12 grid max-w-7xl gap-14 lg:mt-14 lg:grid-cols-12 lg:gap-6">
          <motion.div
            className="order-2 lg:order-none lg:col-span-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="mt-0 mb-8 aspect-video w-full rounded-lg border object-cover"
              />
            )}

            {post.excerpt && (
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 mb-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {readMin} min cteni
              </span>
              <span className="flex items-center gap-1">
                <Eye className="size-3.5" />
                {post.view_count} zobrazeni
              </span>
              {post.tags?.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <article
              className="blog-content prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-xl prose-a:underline-offset-2 prose-blockquote:border-l-primary/50 prose-blockquote:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {related.length > 0 && (
              <>
                <Separator className="my-12" />
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Dalsi clanky
                  </h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-3">
                    {related.map((r) => (
                      <Link key={r.id} to={`/blog/${r.slug}`}>
                        <motion.div
                          className="group overflow-hidden rounded-lg border bg-card"
                          whileHover={{ y: -3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
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
                            <h3 className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-muted-foreground">
                              {r.title}
                            </h3>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {formatDate(r.published_at || r.created_at)}
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            className="order-1 flex h-fit flex-col text-sm lg:sticky lg:top-24 lg:order-none lg:col-span-3 lg:col-start-10 lg:text-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {headings.length > 0 && (
              <div className="order-3 lg:order-none">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Na teto strance
                </span>
                <nav className="mt-2 lg:mt-4">
                  <ul className="space-y-1">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className={cn(
                            "block py-1 transition-colors duration-200",
                            activeSection === h.id
                              ? "text-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            <Separator className="order-2 mt-8 mb-11 lg:hidden" />

            <div className="order-1 flex flex-col gap-2 lg:order-none lg:mt-9">
              <p className="font-medium text-muted-foreground text-xs">
                Sdilet clanek:
              </p>
              <ul className="flex gap-2">
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full size-8"
                    asChild
                  >
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="size-3.5 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-foreground group-hover:text-foreground" />
                    </a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full size-8"
                    asChild
                  >
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="size-3.5 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-foreground group-hover:text-foreground" />
                    </a>
                  </Button>
                </li>
                <li>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group rounded-full size-8"
                    asChild
                  >
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="size-3.5 fill-muted-foreground text-muted-foreground transition-colors group-hover:fill-foreground group-hover:text-foreground" />
                    </a>
                  </Button>
                </li>
              </ul>
            </div>

            <Separator className="my-6 hidden lg:block" />

            <div className="hidden lg:block">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3" />
                Zpet na blog
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PostSkeleton() {
  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto max-w-7xl space-y-4 px-4 sm:px-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-6 h-12 w-3/4" />
        <Skeleton className="h-12 w-1/2" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid gap-14 pt-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-6 w-1/2 mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="lg:col-span-3 lg:col-start-10 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
