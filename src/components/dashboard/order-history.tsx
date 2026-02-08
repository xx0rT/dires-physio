import {
  ArrowUpRight,
  ChevronRight,
  Package,
  RotateCcw,
  Search,
  Star,
  Truck,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

type OrderStatus = "processing" | "shipped" | "delivered" | "returned" | "completed";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  canReturn?: boolean;
  returnByDate?: string;
  type?: "product" | "course";
  courseId?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  deliveryDate?: string;
  trackingUrl?: string;
  type: "product" | "course";
}

const DEFAULT_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "WEB-9847562",
    orderDate: "12. prosince 2024",
    status: "shipped",
    total: 3199,
    type: "product",
    deliveryDate: "18-20. prosince",
    trackingUrl: "#",
    items: [
      {
        id: "1a",
        name: "Terapeutické masážní koule",
        image:
          "https://images.pexels.com/photos/6111394/pexels-photo-6111394.jpeg?auto=compress&cs=tinysrgb&w=400",
        price: 799,
        size: "Univerzální",
        color: "Modrá",
        quantity: 1,
      },
      {
        id: "1b",
        name: "Odporová guma na cvičení",
        image:
          "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400",
        price: 499,
        size: "Střední",
        color: "Zelená",
        quantity: 1,
      },
      {
        id: "1c",
        name: "Jóga podložka premium",
        image:
          "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400",
        price: 1899,
        size: "180 x 60 cm",
        color: "Fialová",
        quantity: 1,
      },
    ],
  },
  {
    id: "2",
    orderNumber: "WEB-9841203",
    orderDate: "5. prosince 2024",
    status: "delivered",
    total: 2248,
    type: "product",
    deliveryDate: "10. prosince",
    items: [
      {
        id: "2a",
        name: "Balanční deska",
        image: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=400",
        price: 1499,
        size: "40 cm průměr",
        color: "Černá",
        quantity: 1,
        canReturn: true,
        returnByDate: "10. ledna 2025",
      },
      {
        id: "2b",
        name: "Sportovní ručník",
        image:
          "https://images.pexels.com/photos/6111612/pexels-photo-6111612.jpeg?auto=compress&cs=tinysrgb&w=400",
        price: 749,
        size: "Univerzální",
        color: "Tmavě šedá",
        quantity: 1,
        canReturn: true,
        returnByDate: "10. ledna 2025",
      },
    ],
  },
  {
    id: "3",
    orderNumber: "WEB-9835678",
    orderDate: "28. listopadu 2024",
    status: "delivered",
    total: 3997,
    type: "product",
    deliveryDate: "3. prosince",
    items: [
      {
        id: "3a",
        name: "Kompresní bandáž na koleno",
        image:
          "https://images.pexels.com/photos/6111616/pexels-photo-6111616.jpeg?auto=compress&cs=tinysrgb&w=400",
        price: 1299,
        size: "L",
        color: "Béžová",
        quantity: 1,
        canReturn: false,
      },
      {
        id: "3b",
        name: "Terapeutické tepelné polštáře",
        image: "https://images.pexels.com/photos/6111465/pexels-photo-6111465.jpeg?auto=compress&cs=tinysrgb&w=400",
        price: 2698,
        size: "30x40 cm",
        color: "Šedá",
        quantity: 2,
        canReturn: false,
      },
    ],
  },
  {
    id: "4",
    orderNumber: "WEB-9828901",
    orderDate: "15. listopadu 2024",
    status: "returned",
    total: 1149,
    type: "product",
    items: [
      {
        id: "4a",
        name: "Ortopedický podsedák",
        image:
          "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=400",
        price: 1149,
        size: "Univerzální",
        color: "Černá",
        quantity: 1,
      },
    ],
  },
];

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; dotColor: string }
> = {
  processing: {
    label: "Zpracovává se",
    color: "text-amber-600",
    dotColor: "bg-amber-500",
  },
  shipped: {
    label: "Na cestě",
    color: "text-blue-600",
    dotColor: "bg-blue-500",
  },
  delivered: {
    label: "Doručeno",
    color: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
  returned: {
    label: "Vráceno",
    color: "text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  completed: {
    label: "Dokončeno",
    color: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
};

interface OrderHistoryProps {
  className?: string;
}

const OrderHistory = ({
  className,
}: OrderHistoryProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allOrders, setAllOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCoursePurchases();
    } else {
      setAllOrders(DEFAULT_ORDERS);
      setLoading(false);
    }
  }, [user]);

  const loadCoursePurchases = async () => {
    if (!user) return;

    try {
      const { data: purchases } = await supabase
        .from("course_purchases")
        .select(`
          id,
          amount_paid,
          purchased_at,
          course_id,
          courses (
            id,
            title,
            description,
            thumbnail_url
          )
        `)
        .eq("user_id", user.id)
        .order("purchased_at", { ascending: false });

      if (purchases) {
        const courseOrders: Order[] = purchases.map((purchase: any) => {
          const course = purchase.courses;
          return {
            id: purchase.id,
            orderNumber: `CRS-${purchase.id.slice(0, 8).toUpperCase()}`,
            orderDate: new Date(purchase.purchased_at).toLocaleDateString("cs-CZ", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            status: "completed" as OrderStatus,
            total: purchase.amount_paid,
            type: "course" as const,
            items: [
              {
                id: course.id,
                name: course.title,
                image: course.thumbnail_url || "https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg?auto=compress&cs=tinysrgb&w=400",
                price: purchase.amount_paid,
                size: "Online kurz",
                color: "Digitální",
                quantity: 1,
                type: "course" as const,
                courseId: course.id,
              },
            ],
          };
        });

        setAllOrders([...courseOrders, ...DEFAULT_ORDERS]);
      }
    } catch (error) {
      console.error("Error loading course purchases:", error);
      setAllOrders(DEFAULT_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
    }).format(price);
  };

  const filteredOrders = allOrders.filter((order) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" &&
        (order.status === "processing" || order.status === "shipped")) ||
      (activeTab === "delivered" &&
        (order.status === "delivered" || order.status === "completed")) ||
      order.status === activeTab;

    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <section className={cn("py-16 md:py-24", className)}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Vaše objednávky
          </h1>
          <p className="mt-1 text-muted-foreground">
            Sledujte kurzy, produkty a historii nákupů
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Všechny</TabsTrigger>
              <TabsTrigger value="active">Probíhající</TabsTrigger>
              <TabsTrigger value="delivered">Doručené</TabsTrigger>
              <TabsTrigger value="returned">Vrácené</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Hledat objednávky..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:w-64"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status];

            return (
              <Card
                key={order.id}
                className="gap-0 overflow-hidden p-0 shadow-none"
              >
                <div
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-4 px-5 py-4",
                    !(order.status === "shipped" && order.deliveryDate) &&
                      "border-b",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Datum objednávky
                      </p>
                      <p className="text-sm font-medium">{order.orderDate}</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Číslo objednávky
                      </p>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                      <p className="text-xs text-muted-foreground">Celkem</p>
                      <p className="text-sm font-medium">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("size-2 rounded-full", status.dotColor)}
                    />
                    <span className={cn("text-sm font-medium", status.color)}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {order.status === "shipped" && order.deliveryDate && (
                  <div className="flex items-center justify-between gap-4 border-b bg-muted/30 px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
                        <Truck className="size-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Doručení {order.deliveryDate}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Váš balíček je na cestě
                        </p>
                      </div>
                    </div>
                    {order.trackingUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={order.trackingUrl}>
                          Sledovat
                          <ArrowUpRight className="ml-1.5 size-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                <CardContent className="p-0">
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      {index > 0 && <Separator />}
                      <div className="flex gap-5 p-5">
                        <div className="size-24 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
                          <AspectRatio ratio={1}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          </AspectRatio>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{item.name}</h3>
                                {item.type === "course" && (
                                  <GraduationCap className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {item.color} · {item.size}
                                {item.quantity > 1 && ` · Ks ${item.quantity}`}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-semibold">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                            {item.type === "course" && item.courseId && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate(`/course/${item.courseId}`)}
                              >
                                <PlayCircle className="mr-1.5 size-3.5" />
                                Přehrát kurz
                              </Button>
                            )}
                            {order.status === "delivered" && item.type !== "course" && (
                              <>
                                <Button variant="secondary" size="sm">
                                  <RotateCcw className="mr-1.5 size-3.5" />
                                  Koupit znovu
                                </Button>
                                {item.canReturn && (
                                  <Button variant="outline" size="sm">
                                    Vrátit zboží
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  <Star className="mr-1.5 size-3.5" />
                                  Napsat recenzi
                                </Button>
                              </>
                            )}
                            {order.status === "shipped" && (
                              <Button variant="secondary" size="sm">
                                <Package className="mr-1.5 size-3.5" />
                                Sledovat položku
                              </Button>
                            )}
                          </div>

                          {item.canReturn && item.returnByDate && (
                            <p className="mt-3 text-xs text-muted-foreground">
                              Možnost vrácení do {item.returnByDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="flex items-center justify-between border-t bg-muted/20 px-5 py-3">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-foreground"
                  >
                    Zobrazit detail objednávky
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    Potřebujete pomoc?
                  </Button>
                </div>
              </Card>
            );
          })}

          {filteredOrders.length === 0 && (
            <Card className="gap-0 p-0 shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
                  <Package className="size-6 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold">Žádné objednávky</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? `Žádné výsledky pro "${searchQuery}"`
                    : "Zatím nemáte žádné objednávky"}
                </p>
                <Button className="mt-5">Začít nakupovat</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export { OrderHistory };
