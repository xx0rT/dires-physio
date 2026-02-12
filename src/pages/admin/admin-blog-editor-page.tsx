import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { blocksToHtml } from "@/lib/blocks-to-html";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import BlogEditor from "@/components/admin/blog-editor";
import DraggableContentBlocks, {
  type ContentBlock,
} from "@/components/admin/draggable-content-blocks";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  status: "draft" | "published" | "archived";
  tags: string;
  contentBlocks: ContentBlock[];
}

const AdminBlogEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = id && id !== "new";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    status: "draft",
    tags: "",
    contentBlocks: [],
  });

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Blog not found");
        navigate("/admin/blogs");
        return;
      }

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || "",
        content: data.content?.html || "",
        featured_image: data.featured_image || "",
        status: data.status,
        tags: data.tags?.join(", ") || "",
        contentBlocks: (data.content?.blocks as ContentBlock[]) || [],
      });
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleSave = async (status?: "draft" | "published") => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.slug.trim()) {
      toast.error("Please enter a slug");
      return;
    }

    try {
      setLoading(true);

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const generatedHtml =
        formData.contentBlocks.length > 0
          ? blocksToHtml(formData.contentBlocks)
          : formData.content;

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: {
          html: generatedHtml,
          blocks: formData.contentBlocks,
        },
        featured_image: formData.featured_image,
        status: status || formData.status,
        tags: tagsArray,
        author_id: user?.id,
        published_at:
          status === "published" && formData.status !== "published"
            ? new Date().toISOString()
            : undefined,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", id);

        if (error) throw error;
        toast.success("Blog updated successfully");
      } else {
        const { data, error } = await supabase
          .from("blogs")
          .insert([blogData])
          .select()
          .single();

        if (error) throw error;
        toast.success("Blog created successfully");
        navigate(`/admin/blogs/edit/${data.id}`);
      }
    } catch (error: any) {
      console.error("Error saving blog:", error);
      if (error.code === "23505") {
        toast.error("A blog with this slug already exists");
      } else {
        toast.error("Failed to save blog");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blogs")}>
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your blog post" : "Create a new blog post with rich content"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={loading}
          >
            <Save className="mr-2 size-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={loading}
          >
            <Eye className="mr-2 size-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Blog Content</CardTitle>
              <CardDescription>
                Write your blog post content using the editor below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter blog title"
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="blog-post-url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Brief description of the blog post"
                  rows={3}
                />
              </div>

              <Tabs defaultValue="wysiwyg" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wysiwyg">WYSIWYG Editor</TabsTrigger>
                  <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
                </TabsList>
                <TabsContent value="wysiwyg" className="mt-6">
                  <div className="space-y-2">
                    <Label>Main Content</Label>
                    <BlogEditor
                      content={formData.content}
                      onChange={(content) =>
                        setFormData({ ...formData, content })
                      }
                    />
                  </div>
                </TabsContent>
                <TabsContent value="blocks" className="mt-6">
                  <div className="space-y-2">
                    <Label>Drag & Drop Content Blocks</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add and arrange content blocks to build your blog post layout
                    </p>
                    <DraggableContentBlocks
                      blocks={formData.contentBlocks}
                      onChange={(blocks) =>
                        setFormData({ ...formData, contentBlocks: blocks })
                      }
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure blog post settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) =>
                    setFormData({ ...formData, featured_image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
                {formData.featured_image && (
                  <div className="mt-2">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="w-full rounded-lg border object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditorPage;
