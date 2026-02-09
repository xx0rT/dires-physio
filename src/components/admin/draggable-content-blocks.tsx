import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Plus,
  Trash2,
  Type,
  Image as ImageIcon,
  Video,
  Quote,
  Code,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

export interface ContentBlock {
  id: string;
  type: "text" | "image" | "video" | "quote" | "code" | "hero";
  content: Record<string, string>;
}

interface DraggableContentBlocksProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const blockTypes = [
  { value: "text", label: "Text Block", icon: Type },
  { value: "image", label: "Image", icon: ImageIcon },
  { value: "video", label: "Video", icon: Video },
  { value: "quote", label: "Quote", icon: Quote },
  { value: "code", label: "Code Block", icon: Code },
  { value: "hero", label: "Hero Section", icon: Layout },
];

const DraggableContentBlocks = ({
  blocks,
  onChange,
}: DraggableContentBlocksProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type),
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: Record<string, string>) => {
    onChange(
      blocks.map((block) => (block.id === id ? { ...block, content } : block)),
    );
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select onValueChange={(value) => addBlock(value as ContentBlock["type"])}>
          <SelectTrigger className="w-64">
            <Plus className="mr-2 size-4" />
            <SelectValue placeholder="Add content block" />
          </SelectTrigger>
          <SelectContent>
            {blockTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="size-4" />
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onUpdate={updateBlock}
                onRemove={removeBlock}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Layout className="mb-4 size-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No content blocks yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add your first content block to start building your blog post
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface SortableBlockProps {
  block: ContentBlock;
  onUpdate: (id: string, content: Record<string, string>) => void;
  onRemove: (id: string) => void;
}

const SortableBlock = ({ block, onUpdate, onRemove }: SortableBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-card",
        isDragging && "opacity-50 shadow-lg",
      )}
    >
      <div className="flex items-center gap-2 border-b p-3">
        <button
          type="button"
          className="cursor-grab touch-none hover:bg-muted rounded p-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <span className="text-sm font-medium capitalize">{block.type} Block</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(block.id)}
        >
          <Trash2 className="size-4 text-red-500" />
        </Button>
      </div>
      <div className="p-4">
        <BlockEditor block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

interface BlockEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: Record<string, string>) => void;
}

const BlockEditor = ({ block, onUpdate }: BlockEditorProps) => {
  const updateField = (field: string, value: string) => {
    onUpdate(block.id, { ...block.content, [field]: value });
  };

  switch (block.type) {
    case "text":
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${block.id}-title`}>Title (Optional)</Label>
            <Input
              id={`${block.id}-title`}
              value={block.content.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div>
            <Label htmlFor={`${block.id}-text`}>Content</Label>
            <Textarea
              id={`${block.id}-text`}
              value={block.content.text || ""}
              onChange={(e) => updateField("text", e.target.value)}
              placeholder="Enter your content"
              rows={5}
            />
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${block.id}-url`}>Image URL</Label>
            <Input
              id={`${block.id}-url`}
              value={block.content.url || ""}
              onChange={(e) => updateField("url", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label htmlFor={`${block.id}-alt`}>Alt Text</Label>
            <Input
              id={`${block.id}-alt`}
              value={block.content.alt || ""}
              onChange={(e) => updateField("alt", e.target.value)}
              placeholder="Describe the image"
            />
          </div>
          <div>
            <Label htmlFor={`${block.id}-caption`}>Caption (Optional)</Label>
            <Input
              id={`${block.id}-caption`}
              value={block.content.caption || ""}
              onChange={(e) => updateField("caption", e.target.value)}
              placeholder="Image caption"
            />
          </div>
          {block.content.url && (
            <div className="mt-2">
              <img
                src={block.content.url}
                alt={block.content.alt || "Preview"}
                className="max-h-64 rounded-lg border object-cover"
              />
            </div>
          )}
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${block.id}-url`}>Video URL (YouTube/Vimeo)</Label>
            <Input
              id={`${block.id}-url`}
              value={block.content.url || ""}
              onChange={(e) => updateField("url", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div>
            <Label htmlFor={`${block.id}-caption`}>Caption (Optional)</Label>
            <Input
              id={`${block.id}-caption`}
              value={block.content.caption || ""}
              onChange={(e) => updateField("caption", e.target.value)}
              placeholder="Video caption"
            />
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${block.id}-quote`}>Quote</Label>
            <Textarea
              id={`${block.id}-quote`}
              value={block.content.quote || ""}
              onChange={(e) => updateField("quote", e.target.value)}
              placeholder="Enter quote"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor={`${block.id}-author`}>Author (Optional)</Label>
            <Input
              id={`${block.id}-author`}
              value={block.content.author || ""}
              onChange={(e) => updateField("author", e.target.value)}
              placeholder="Quote author"
            />
          </div>
        </div>
      );

    case "code":
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${block.id}-language`}>Language</Label>
            <Input
              id={`${block.id}-language`}
              value={block.content.language || ""}
              onChange={(e) => updateField("language", e.target.value)}
              placeholder="javascript, python, etc."
            />
          </div>
          <div>
            <Label htmlFor={`${block.id}-code`}>Code</Label>
            <Textarea
              id={`${block.id}-code`}
              value={block.content.code || ""}
              onChange={(e) => updateField("code", e.target.value)}
              placeholder="Enter code"
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        </div>
      );

    case "hero":
      return (
        <div className="space-y-3">
          <div>
            <Label htmlFor={`${block.id}-title`}>Title</Label>
            <Input
              id={`${block.id}-title`}
              value={block.content.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Hero title"
            />
          </div>
          <div>
            <Label htmlFor={`${block.id}-subtitle`}>Subtitle</Label>
            <Input
              id={`${block.id}-subtitle`}
              value={block.content.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Hero subtitle"
            />
          </div>
          <div>
            <Label htmlFor={`${block.id}-background`}>Background Image URL</Label>
            <Input
              id={`${block.id}-background`}
              value={block.content.background || ""}
              onChange={(e) => updateField("background", e.target.value)}
              placeholder="https://example.com/bg.jpg"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

const getDefaultContent = (type: ContentBlock["type"]): Record<string, string> => {
  switch (type) {
    case "text":
      return { title: "", text: "" };
    case "image":
      return { url: "", alt: "", caption: "" };
    case "video":
      return { url: "", caption: "" };
    case "quote":
      return { quote: "", author: "" };
    case "code":
      return { language: "javascript", code: "" };
    case "hero":
      return { title: "", subtitle: "", background: "" };
    default:
      return {};
  }
};

export default DraggableContentBlocks;
