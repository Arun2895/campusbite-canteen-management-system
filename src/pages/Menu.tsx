import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/canteen/Header";
import { CategoryFilter } from "@/components/canteen/CategoryFilter";
import { MenuCard } from "@/components/canteen/MenuCard";
import { CartSheet } from "@/components/canteen/CartSheet";
import { OrderConfirmation } from "@/components/canteen/OrderConfirmation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Order } from "@/types/canteen";
import { toast } from "sonner";

export default function Menu() {
  const [itemsFromDB, setItemsFromDB] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<Order | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { addItem, items, total, clearCart } = useCart();
  const { user } = useAuth();

  // ✅ Fetch items from Supabase
  useEffect(() => {
    fetchItems();

    // Real-time listener
    const channel = supabase
      .channel("items-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "❌ Failed to fetch items:",
          error.message,
          error.details
        );
      } else {
        setItemsFromDB(
          (data || []).map((row: Record<string, unknown>) => ({
            ...row,
            image_url: row.image_url ?? null,
          }))
        );
      }
    } catch (err) {
      console.error("❌ Unexpected error fetching items:", err);
    }
  };

  // Category display names and icons
  const categoryMeta: Record<string, { name: string; icon: string }> = {
    all: { name: "All", icon: "🍽️" },
    breakfast: { name: "Breakfast", icon: "🍳" },
    main: { name: "Main", icon: "🍛" },
    snacks: { name: "Snacks", icon: "🍟" },
    beverages: { name: "Beverages", icon: "🥤" },
    desserts: { name: "Desserts", icon: "🍰" },
  };

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        itemsFromDB
          .map((item) => item.category)
          .filter((c): c is string => c != null && c !== "")
      ),
    ].sort();
    const list = [
      { id: "all", name: categoryMeta.all.name, icon: categoryMeta.all.icon },
      ...unique.map((id) => ({
        id,
        name: categoryMeta[id]?.name ?? id.charAt(0).toUpperCase() + id.slice(1),
        icon: categoryMeta[id]?.icon ?? "🍽️",
      })),
    ];
    return list;
  }, [itemsFromDB]);

  // Filter items
  const filteredItems = useMemo(() => {
    return itemsFromDB.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [itemsFromDB, activeCategory, searchQuery]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!user?.name) {
      toast.error("Please log in first");
      return;
    }

    // Validate stock before placing order
    const { data: currentItems } = await supabase.from("items").select("id, stock, is_available");
    const stockMap = new Map((currentItems || []).map((i) => [i.id, { stock: i.stock, is_available: i.is_available }]));
    const outOfStock = items.some((cartItem) => {
      const item = stockMap.get(cartItem.id);
      return !item || item.stock < cartItem.quantity || !item.is_available;
    });
    if (outOfStock) {
      toast.error("One or more items are out of stock. Please update your cart.");
      return;
    }

    try {
      const counterNumber = Math.floor(Math.random() * 20) + 1;

      // Create order with correct column names
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: user.name,
            counter_number: counterNumber,
            total_amount: total,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error(
          "❌ Failed to create order:",
          orderError.message,
          orderError.details
        );
        toast.error(`Error creating order: ${orderError.message}`);
        return;
      }

      const orderId = orderData.id;

      // Insert order items with price
      const orderItemsPayload = items.map((item) => ({
        order_id: orderId,
        item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);

      if (itemsError) {
        console.error(
          "❌ Failed to save order items:",
          itemsError.message,
          itemsError.details
        );
        toast.error(`Error saving order items: ${itemsError.message}`);
        return;
      }

      const order: Order = {
        id: orderId,
        items: [...items],
        total,
        status: "pending",
        counterNumber,
        createdAt: new Date(),
        customerName: user.name,
      };

      setOrderConfirmation(order);
      setShowConfirmation(true);
      clearCart();
    } catch (err) {
      console.error("❌ Unexpected error during checkout:", err);
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  const handleNewOrder = () => {
    setShowConfirmation(false);
    setOrderConfirmation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="container py-6">
        <section className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            What would you like to eat{" "}
            <span className="text-gradient">today?</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Order ahead and skip the queue
          </p>
        </section>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for dishes..."
            className="h-12 rounded-xl pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories: All, Snacks, etc. — directly below search */}
        <section className="mb-6">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        {/* Menu Grid */}
        <section>
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium">No items found</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MenuCard
                    item={{
                      ...item,
                      outOfStock: item.stock <= 0,
                    }}
                    onAddToCart={addItem}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        onCheckout={handleCheckout}
      />

      <OrderConfirmation
        order={orderConfirmation}
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onNewOrder={handleNewOrder}
      />
    </div>
  );
}
