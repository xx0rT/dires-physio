import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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
  Table2,
  AlertTriangle,
  HelpCircle,
  BarChart3,
  Highlighter,
  Share2,
  Minus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { blockEditorMap } from "./content-block-editors";

export interface ContentBlock {
  id: string;
  type:
    | "text"
    | "image"
    | "video"
    | "quote"
    | "code"
    | "hero"
    | "table"
    | "callout"
    | "faq"
    | "poll"
    | "highlight"
    | "social"
    | "divider"
    | "seo";
  content: Record<string, string>;
}

interface DraggableContentBlocksProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const blockTypes = [
  { value: "text", label: "Textový blok", icon: Type },
  { value: "image", label: "Obrázek", icon: ImageIcon },
  { value: "video", label: "Video", icon: Video },
  { value: "quote", label: "Citace", icon: Quote },
  { value: "code", label: "Blok kódu", icon: Code },
  { value: "hero", label: "Hero sekce", icon: Layout },
  { value: "table", label: "Tabulka", icon: Table2 },
  { value: "callout", label: "Upozornění", icon: AlertTriangle },
  { value: "faq", label: "Časté dotazy", icon: HelpCircle },
  { value: "poll", label: "Anketa", icon: BarChart3 },
  { value: "highlight", label: "Zvýraznění", icon: Highlighter },
  { value: "social", label: "Sociální sítě", icon: Share2 },
  { value: "divider", label: "Oddělovač", icon: Minus },
  { value: "seo", label: "SEO náhled", icon: Search },
];

const defaultContentMap: Record<string, Record<string, string>> = {
  text: { title: "", text: "" },
  image: { url: "", alt: "", caption: "" },
  video: { url: "", caption: "" },
  quote: { quote: "", author: "" },
  code: { language: "javascript", code: "" },
  hero: { title: "", subtitle: "", background: "" },
  table: { headers: '["Sloupec 1","Sloupec 2"]', rows: '[["",""]]\n' },
  callout: { type: "info", title: "", content: "" },
  faq: { items: "[]" },
  poll: { question: "", options: "[]" },
  highlight: { text: "", color: "blue" },
  social: { platform: "twitter", url: "", text: "" },
  divider: { style: "line" },
  seo: { seoTitle: "", seoUrl: "", seoDescription: "" },
};

const DraggableContentBlocks = ({
  blocks,
  onChange,
}: DraggableContentBlocksProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: { ...(defaultContentMap[type] || {}) },
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: Record<string, string>) => {
    onChange(
      blocks.map((b) => (b.id === id ? { ...b, content } : b))
    );
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          onValueChange={(value) => addBlock(value as ContentBlock["type"])}
        >
          <SelectTrigger className="w-64">
            <Plus className="mr-2 size-4" />
            <SelectValue placeholder="Přidat blok obsahu" />
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
            <h3 className="mb-2 text-lg font-semibold">
              Zatím žádné bloky obsahu
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Přidejte první blok obsahu a začněte vytvářet článek
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

const blockLabel: Record<string, string> = {
  text: "Text",
  image: "Obrázek",
  video: "Video",
  quote: "Citace",
  code: "Kód",
  hero: "Hero",
  table: "Tabulka",
  callout: "Upozornění",
  faq: "FAQ",
  poll: "Anketa",
  highlight: "Zvýraznění",
  social: "Sociální",
  divider: "Oddělovač",
  seo: "SEO",
};

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

  const Editor = blockEditorMap[block.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-card",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="flex items-center gap-2 border-b p-3">
        <button
          type="button"
          className="cursor-grab touch-none rounded p-1 hover:bg-muted"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <span className="text-sm font-medium">
            Blok: {blockLabel[block.type] || block.type}
          </span>
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
        {Editor ? (
          <Editor block={block} onUpdate={onUpdate} />
        ) : null}
      </div>
    </div>
  );
};

export default DraggableContentBlocks;
