import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContentBlock } from "./draggable-content-blocks";

interface BlockEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: Record<string, string>) => void;
}

function updateField(
  block: ContentBlock,
  onUpdate: BlockEditorProps["onUpdate"],
  field: string,
  value: string
) {
  onUpdate(block.id, { ...block.content, [field]: value });
}

export function TextBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Title (Optional)</Label>
        <Input
          value={block.content.title || ""}
          onChange={(e) => updateField(block, onUpdate, "title", e.target.value)}
          placeholder="Enter title"
        />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea
          value={block.content.text || ""}
          onChange={(e) => updateField(block, onUpdate, "text", e.target.value)}
          placeholder="Enter your content"
          rows={5}
        />
      </div>
    </div>
  );
}

export function ImageBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Image URL</Label>
        <Input
          value={block.content.url || ""}
          onChange={(e) => updateField(block, onUpdate, "url", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div>
        <Label>Alt Text</Label>
        <Input
          value={block.content.alt || ""}
          onChange={(e) => updateField(block, onUpdate, "alt", e.target.value)}
          placeholder="Describe the image"
        />
      </div>
      <div>
        <Label>Caption (Optional)</Label>
        <Input
          value={block.content.caption || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "caption", e.target.value)
          }
          placeholder="Image caption"
        />
      </div>
      {block.content.url && (
        <img
          src={block.content.url}
          alt={block.content.alt || "Preview"}
          className="max-h-48 rounded-lg border object-cover"
        />
      )}
    </div>
  );
}

export function VideoBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Video URL (YouTube/Vimeo)</Label>
        <Input
          value={block.content.url || ""}
          onChange={(e) => updateField(block, onUpdate, "url", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
      <div>
        <Label>Caption (Optional)</Label>
        <Input
          value={block.content.caption || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "caption", e.target.value)
          }
          placeholder="Video caption"
        />
      </div>
    </div>
  );
}

export function QuoteBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Quote</Label>
        <Textarea
          value={block.content.quote || ""}
          onChange={(e) => updateField(block, onUpdate, "quote", e.target.value)}
          placeholder="Enter quote"
          rows={4}
        />
      </div>
      <div>
        <Label>Author (Optional)</Label>
        <Input
          value={block.content.author || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "author", e.target.value)
          }
          placeholder="Quote author"
        />
      </div>
    </div>
  );
}

export function CodeBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Language</Label>
        <Input
          value={block.content.language || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "language", e.target.value)
          }
          placeholder="javascript, python, etc."
        />
      </div>
      <div>
        <Label>Code</Label>
        <Textarea
          value={block.content.code || ""}
          onChange={(e) => updateField(block, onUpdate, "code", e.target.value)}
          placeholder="Enter code"
          rows={8}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}

export function HeroBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Title</Label>
        <Input
          value={block.content.title || ""}
          onChange={(e) => updateField(block, onUpdate, "title", e.target.value)}
          placeholder="Hero title"
        />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input
          value={block.content.subtitle || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "subtitle", e.target.value)
          }
          placeholder="Hero subtitle"
        />
      </div>
      <div>
        <Label>Background Image URL</Label>
        <Input
          value={block.content.background || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "background", e.target.value)
          }
          placeholder="https://example.com/bg.jpg"
        />
      </div>
    </div>
  );
}

export function TableBlockEditor({ block, onUpdate }: BlockEditorProps) {
  const headers: string[] = (() => {
    try {
      return JSON.parse(block.content.headers || "[]");
    } catch {
      return [];
    }
  })();
  const rows: string[][] = (() => {
    try {
      return JSON.parse(block.content.rows || "[]");
    } catch {
      return [];
    }
  })();

  const setHeaders = (h: string[]) =>
    onUpdate(block.id, { ...block.content, headers: JSON.stringify(h) });
  const setRows = (r: string[][]) =>
    onUpdate(block.id, { ...block.content, rows: JSON.stringify(r) });

  const addColumn = () => {
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setRows(rows.map((r) => [...r, ""]));
  };

  const removeColumn = (idx: number) => {
    setHeaders(headers.filter((_, i) => i !== idx));
    setRows(rows.map((r) => r.filter((_, i) => i !== idx)));
  };

  const addRow = () => {
    setRows([...rows, new Array(Math.max(headers.length, 1)).fill("")]);
  };

  const removeRow = (idx: number) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  const updateHeader = (idx: number, val: string) => {
    const copy = [...headers];
    copy[idx] = val;
    setHeaders(copy);
  };

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const copy = rows.map((r) => [...r]);
    copy[rowIdx][colIdx] = val;
    setRows(copy);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addColumn}>
          <Plus className="mr-1 size-3" /> Column
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-1 size-3" /> Row
        </Button>
      </div>
      {headers.length > 0 && (
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="border-b bg-muted p-1">
                    <div className="flex items-center gap-1">
                      <Input
                        value={h}
                        onChange={(e) => updateHeader(i, e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="size-6 p-0"
                        onClick={() => removeColumn(i)}
                      >
                        <Trash2 className="size-3 text-red-500" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border-b p-1">
                      <Input
                        value={cell}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        className="h-7 text-xs"
                      />
                    </td>
                  ))}
                  <td className="border-b p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="size-6 p-0"
                      onClick={() => removeRow(ri)}
                    >
                      <Trash2 className="size-3 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function CalloutBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Type</Label>
        <Select
          value={block.content.type || "info"}
          onValueChange={(val) => updateField(block, onUpdate, "type", val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tip">Tip</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Title</Label>
        <Input
          value={block.content.title || ""}
          onChange={(e) => updateField(block, onUpdate, "title", e.target.value)}
          placeholder="Callout title"
        />
      </div>
      <div>
        <Label>Content</Label>
        <Textarea
          value={block.content.content || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "content", e.target.value)
          }
          placeholder="Callout content"
          rows={3}
        />
      </div>
    </div>
  );
}

export function FaqBlockEditor({ block, onUpdate }: BlockEditorProps) {
  const items: { question: string; answer: string }[] = (() => {
    try {
      return JSON.parse(block.content.items || "[]");
    } catch {
      return [];
    }
  })();

  const setItems = (newItems: { question: string; answer: string }[]) =>
    onUpdate(block.id, {
      ...block.content,
      items: JSON.stringify(newItems),
    });

  const addItem = () =>
    setItems([...items, { question: "", answer: "" }]);

  const removeItem = (idx: number) =>
    setItems(items.filter((_, i) => i !== idx));

  const updateItem = (
    idx: number,
    field: "question" | "answer",
    value: string
  ) => {
    const copy = items.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setItems(copy);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded border p-3">
          <div className="flex items-center justify-between">
            <Label>Question {i + 1}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(i)}
            >
              <Trash2 className="size-3 text-red-500" />
            </Button>
          </div>
          <Input
            value={item.question}
            onChange={(e) => updateItem(i, "question", e.target.value)}
            placeholder="Enter question"
          />
          <Label>Answer</Label>
          <Textarea
            value={item.answer}
            onChange={(e) => updateItem(i, "answer", e.target.value)}
            placeholder="Enter answer"
            rows={2}
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus className="mr-1 size-3" /> Add Question
      </Button>
    </div>
  );
}

export function PollBlockEditor({ block, onUpdate }: BlockEditorProps) {
  const options: { label: string; percentage: number }[] = (() => {
    try {
      return JSON.parse(block.content.options || "[]");
    } catch {
      return [];
    }
  })();

  const setOptions = (newOpts: { label: string; percentage: number }[]) =>
    onUpdate(block.id, {
      ...block.content,
      options: JSON.stringify(newOpts),
    });

  const addOption = () =>
    setOptions([...options, { label: "", percentage: 0 }]);

  const removeOption = (idx: number) =>
    setOptions(options.filter((_, i) => i !== idx));

  const updateOption = (
    idx: number,
    field: "label" | "percentage",
    value: string
  ) => {
    const copy = options.map((opt, i) =>
      i === idx
        ? {
            ...opt,
            [field]: field === "percentage" ? Number(value) || 0 : value,
          }
        : opt
    );
    setOptions(copy);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Question</Label>
        <Input
          value={block.content.question || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "question", e.target.value)
          }
          placeholder="Poll question"
        />
      </div>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={opt.label}
            onChange={(e) => updateOption(i, "label", e.target.value)}
            placeholder="Option label"
            className="flex-1"
          />
          <Input
            type="number"
            value={opt.percentage}
            onChange={(e) => updateOption(i, "percentage", e.target.value)}
            placeholder="%"
            className="w-20"
            min={0}
            max={100}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeOption(i)}
          >
            <Trash2 className="size-3 text-red-500" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addOption}>
        <Plus className="mr-1 size-3" /> Add Option
      </Button>
    </div>
  );
}

export function HighlightBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Color</Label>
        <Select
          value={block.content.color || "blue"}
          onValueChange={(val) => updateField(block, onUpdate, "color", val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blue">Blue</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="yellow">Yellow</SelectItem>
            <SelectItem value="red">Red</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Text</Label>
        <Textarea
          value={block.content.text || ""}
          onChange={(e) => updateField(block, onUpdate, "text", e.target.value)}
          placeholder="Highlighted text content"
          rows={3}
        />
      </div>
    </div>
  );
}

export function SocialBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Platform</Label>
        <Select
          value={block.content.platform || "twitter"}
          onValueChange={(val) =>
            updateField(block, onUpdate, "platform", val)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="twitter">Twitter / X</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>URL</Label>
        <Input
          value={block.content.url || ""}
          onChange={(e) => updateField(block, onUpdate, "url", e.target.value)}
          placeholder="https://twitter.com/..."
        />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          value={block.content.text || ""}
          onChange={(e) => updateField(block, onUpdate, "text", e.target.value)}
          placeholder="Post description or text"
        />
      </div>
    </div>
  );
}

export function DividerBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Style</Label>
        <Select
          value={block.content.style || "line"}
          onValueChange={(val) => updateField(block, onUpdate, "style", val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Simple Line</SelectItem>
            <SelectItem value="dots">Dots</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function SeoBlockEditor({ block, onUpdate }: BlockEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <Label>SEO Title</Label>
        <Input
          value={block.content.seoTitle || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "seoTitle", e.target.value)
          }
          placeholder="Page title for search engines"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {(block.content.seoTitle || "").length}/60 characters
        </p>
      </div>
      <div>
        <Label>SEO URL</Label>
        <Input
          value={block.content.seoUrl || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "seoUrl", e.target.value)
          }
          placeholder="https://example.com/blog/your-post"
        />
      </div>
      <div>
        <Label>Meta Description</Label>
        <Textarea
          value={block.content.seoDescription || ""}
          onChange={(e) =>
            updateField(block, onUpdate, "seoDescription", e.target.value)
          }
          placeholder="Description for search engines"
          rows={2}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {(block.content.seoDescription || "").length}/160 characters
        </p>
      </div>
      <div className="rounded border p-3">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Google Preview
        </p>
        <div className="text-base font-medium text-blue-700 dark:text-blue-400">
          {block.content.seoTitle || "Page Title"}
        </div>
        <div className="text-xs text-green-700 dark:text-green-400">
          {block.content.seoUrl || "https://example.com/blog/..."}
        </div>
        <div className="text-xs text-muted-foreground">
          {block.content.seoDescription || "Meta description..."}
        </div>
      </div>
    </div>
  );
}

export const blockEditorMap: Record<
  string,
  React.ComponentType<BlockEditorProps>
> = {
  text: TextBlockEditor,
  image: ImageBlockEditor,
  video: VideoBlockEditor,
  quote: QuoteBlockEditor,
  code: CodeBlockEditor,
  hero: HeroBlockEditor,
  table: TableBlockEditor,
  callout: CalloutBlockEditor,
  faq: FaqBlockEditor,
  poll: PollBlockEditor,
  highlight: HighlightBlockEditor,
  social: SocialBlockEditor,
  divider: DividerBlockEditor,
  seo: SeoBlockEditor,
};
