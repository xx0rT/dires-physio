import {
  CreditCard,
  GraduationCap,
  Package,
  PlayCircle,
  Search,
  ShoppingBag,
  Repeat,
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

type OrderType = "course" | "product" | "subscription";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  detail: string;
  quantity: number;
  type: OrderType;
  courseId?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  rawDate: string;
  status: string;
  total: number;
  items: OrderItem[];
  type: OrderType;
}

const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  completed: {
    label: "Dokonceno",
    color: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
  active: {
    label: "Aktivni",
    color: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
  pending: {
    label: "Zpracovava se",
    color: "text-amber-600",
    dotColor: "bg-amber-500",
  },
  cancelled: {
    label: "Zruseno",
    color: "text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  expired: {
    label: "Vyprselo",
    color: "text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
};

const planLabels: Record<string, string> = {
  free_trial: "Zkusebni verze",
  monthly: "Mesicni predplatne",
  lifetime: "Dozivotni predplatne",
};

interface OrderHistoryProps {
  className?: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
  }).format(price);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const OrderHistory = ({ className }: OrderHistoryProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAllPayments();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  const loadAllPayments = async () => {
    if (!user) return;

    try {
      const [
        { data: coursePurchases },
        { data: productOrders },
        { data: subscriptionData },
      ] = await Promise.all([
        supabase
          .from("course_purchases")
          .select(`
            id,
            amount_paid,
            purchased_at,
            course_id,
            courses (id, title, thumbnail_url)
          `)
          .eq("user_id", user.id)
          .order("purchased_at", { ascending: false }),

        supabase
          .from("orders")
          .select(`
            id,
            status,
            total,
            created_at,
            order_items (
              id,
              quantity,
              price,
              product_id,
              products (id, name, image_url)
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),

        supabase
          .from("subscriptions")
          .select("id, plan_type, status, current_period_start, current_period_end, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      const allOrders: Order[] = [];

      if (coursePurchases) {
        for (const purchase of coursePurchases) {
          const course = (purchase as any).courses;
          if (!course) continue;
          allOrders.push({
            id: `cp-${purchase.id}`,
            orderNumber: `CRS-${purchase.id.slice(0, 8).toUpperCase()}`,
            orderDate: formatDate(purchase.purchased_at),
            rawDate: purchase.purchased_at,
            status: "completed",
            total: purchase.amount_paid,
            type: "course",
            items: [
              {
                id: course.id,
                name: course.title,
                image:
                  course.thumbnail_url ||
                  "https://images.pexels.com/photos/4506109/pexels-photo-4506109.jpeg?auto=compress&cs=tinysrgb&w=400",
                price: purchase.amount_paid,
                detail: "Online kurz",
                quantity: 1,
                type: "course",
                courseId: course.id,
              },
            ],
          });
        }
      }

      if (productOrders) {
        for (const order of productOrders) {
          const items = ((order as any).order_items || []).map((item: any) => {
            const product = item.products;
            return {
              id: item.id,
              name: product?.name || "Produkt",
              image:
                product?.image_url ||
                "https://images.pexels.com/photos/6111394/pexels-photo-6111394.jpeg?auto=compress&cs=tinysrgb&w=400",
              price: item.price,
              detail: `Ks: ${item.quantity}`,
              quantity: item.quantity,
              type: "product" as OrderType,
            };
          });

          const statusMap: Record<string, string> = {
            pending: "pending",
            paid: "completed",
            shipped: "active",
            delivered: "completed",
            cancelled: "cancelled",
          };

          allOrders.push({
            id: `ord-${order.id}`,
            orderNumber: `ORD-${order.id.slice(0, 8).toUpperCase()}`,
            orderDate: formatDate(order.created_at),
            rawDate: order.created_at,
            status: statusMap[order.status] || order.status,
            total: order.total,
            type: "product",
            items,
          });
        }
      }

      if (subscriptionData) {
        for (const sub of subscriptionData) {
          if (sub.plan_type === "free_trial") continue;

          const subStatus =
            sub.status === "active"
              ? "active"
              : sub.status === "canceled" || sub.status === "cancelled"
                ? "cancelled"
                : sub.status === "expired"
                  ? "expired"
                  : "completed";

          const periodLabel = sub.current_period_start && sub.current_period_end
            ? `${formatDate(sub.current_period_start)} - ${formatDate(sub.current_period_end)}`
            : "";

          allOrders.push({
            id: `sub-${sub.id}`,
            orderNumber: `SUB-${sub.id.slice(0, 8).toUpperCase()}`,
            orderDate: formatDate(sub.created_at),
            rawDate: sub.created_at,
            status: subStatus,
            total: sub.plan_type === "lifetime" ? 9990 : sub.plan_type === "monthly" ? 499 : 0,
            type: "subscription",
            items: [
              {
                id: sub.id,
                name: planLabels[sub.plan_type] || sub.plan_type,
                image:
                  "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400",
                price: sub.plan_type === "lifetime" ? 9990 : sub.plan_type === "monthly" ? 499 : 0,
                detail: periodLabel,
                quantity: 1,
                type: "subscription",
              },
            ],
          });
        }
      }

      allOrders.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "courses" && order.type === "course") ||
      (activeTab === "subscriptions" && order.type === "subscription") ||
      (activeTab === "products" && order.type === "product");

    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesTab && matchesSearch;
  });

  const typeIcon = (type: OrderType) => {
    switch (type) {
      case "course":
        return <GraduationCap className="size-4 text-blue-600" />;
      case "subscription":
        return <Repeat className="size-4 text-emerald-600" />;
      case "product":
        return <ShoppingBag className="size-4 text-orange-600" />;
    }
  };

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
            Vase objednavky
          </h1>
          <p className="mt-1 text-muted-foreground">
            Prehled vsech vasich plateb a nakupu
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Vsechny</TabsTrigger>
              <TabsTrigger value="courses">Kurzy</TabsTrigger>
              <TabsTrigger value="subscriptions">Predplatne</TabsTrigger>
              <TabsTrigger value="products">Produkty</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Hledat objednavky..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:w-64"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.completed;

            return (
              <Card
                key={order.id}
                className="gap-0 overflow-hidden p-0 shadow-none"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <div className="flex items-center gap-2">
                      {typeIcon(order.type)}
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Datum
                        </p>
                        <p className="text-sm font-medium">{order.orderDate}</p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Cislo
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
                                {item.type === "subscription" && (
                                  <CreditCard className="h-4 w-4 text-emerald-600" />
                                )}
                              </div>
                              {item.detail && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {item.detail}
                                </p>
                              )}
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
                                onClick={() => navigate(`/kurz/${item.courseId}`)}
                              >
                                <PlayCircle className="mr-1.5 size-3.5" />
                                Prehrat kurz
                              </Button>
                            )}
                            {item.type === "subscription" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate("/prehled/fakturace")}
                              >
                                <CreditCard className="mr-1.5 size-3.5" />
                                Spravovat predplatne
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                <div className="flex items-center justify-end border-t bg-muted/20 px-5 py-3">
                  <Button variant="ghost" size="sm">
                    Potrebujete pomoc?
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
                <h2 className="text-lg font-semibold">Zadne objednavky</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery
                    ? `Zadne vysledky pro "${searchQuery}"`
                    : "Zatim nemame zaznam o zadnych platbach"}
                </p>
                <Button className="mt-5" onClick={() => navigate("/kurzy")}>
                  Prohlednou kurzy
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export { OrderHistory };
