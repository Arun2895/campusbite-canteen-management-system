import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Package,
  DollarSign,
  ShoppingCart,
  Trash2,
  Plus,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  is_available: boolean;
}

interface Order {
  id: string;
  customer_name: string;
  counter_number: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function Admin() {
  const [items, setItems] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    fetchItems();
    fetchOrders();
    
    // Real-time listener for orders
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase.from("items").select("*");

      if (error) {
        console.error(
          "❌ Failed to fetch items:",
          error.message,
          error.details
        );
        alert(`Error fetching items: ${error.message}`);
      } else {
        console.log("✅ Fetched items:", data);
        setItems(data || []);
      }
    } catch (err) {
      console.error("❌ Unexpected error fetching items:", err);
      alert(
        "Unexpected error: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const totalItemsInStock = useMemo(() => {
    return items.reduce((total, item) => total + item.stock, 0);
  }, [items]);

  const pendingOrdersCount = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const stats = [
    { label: "Total Revenue", value: "₹0", icon: DollarSign },
    { label: "Pending Orders", value: pendingOrdersCount.toString(), icon: ShoppingCart },
    { label: "Items in Stock", value: totalItemsInStock.toString(), icon: Package },
  ];

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.price || !newItem.stock) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("items")
        .insert([
          {
            name: newItem.name,
            category: newItem.category.toLowerCase(),
            price: parseFloat(newItem.price),
            stock: parseInt(newItem.stock),
            is_available: parseInt(newItem.stock) > 0,
          },
        ])
        .select();

      if (error) {
        console.error(
          "❌ Failed to add item:",
          error.message,
          error.details
        );
        alert(`Failed to add item: ${error.message}`);
      } else {
        console.log("✅ Item added:", data);
        alert("Item added successfully ✅");
        fetchItems();
        setNewItem({ name: "", category: "", price: "", stock: "" });
        setIsAddDialogOpen(false);
      }
    } catch (err) {
      console.error("❌ Unexpected error adding item:", err);
      alert(
        "Unexpected error: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "❌ Failed to fetch orders:",
          error.message,
          error.details
        );
      } else {
        console.log("✅ Fetched orders:", data);
        setOrders(data || []);
      }
    } catch (err) {
      console.error("❌ Unexpected error fetching orders:", err);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    setAcceptingOrderId(orderId);
    console.log("🔄 Accepting order:", orderId);
    
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: "accepted" })
        .eq("id", orderId)
        .select();

      console.log("Response data:", data);
      console.log("Response error:", error);

      if (error) {
        console.error(
          "❌ Failed to accept order:",
          error.message,
          error.details,
          error.hint
        );
        alert(`Failed to accept order: ${error.message}`);
        return;
      }

      console.log("✅ Order accepted successfully:", data);
      alert("Order accepted successfully ✅");
      await fetchOrders();
    } catch (err) {
      console.error("❌ Unexpected error accepting order:", err);
      alert(
        "Unexpected error: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setAcceptingOrderId(null);
    }
  };
  const handleDeleteItem = async () => {
    if (!deleteItemId) return;

    try {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", deleteItemId);

      if (error) {
        console.error(
          "❌ Failed to delete item:",
          error.message,
          error.details
        );
        alert(`Failed to delete item: ${error.message}`);
      } else {
        console.log("✅ Item deleted");
        alert("Item deleted ✅");
        fetchItems();
        setDeleteItemId(null);
      }
    } catch (err) {
      console.error("❌ Unexpected error deleting item:", err);
      alert(
        "Unexpected error: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card className="max-w-6xl mx-auto">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Pending Requests
              </CardTitle>
            </CardHeader>

            <CardContent>
              {orders.filter((order) => order.status === "pending").length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pending orders
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Counter</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders
                      .filter((order) => order.status === "pending")
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.id.slice(0, 8)}
                          </TableCell>
                          <TableCell>{order.customer_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-lg">
                              {order.counter_number}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ₹{order.total_amount}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-yellow-500 text-white">
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => handleAcceptOrder(order.id)}
                              disabled={acceptingOrderId === order.id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="max-w-6xl mx-auto">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Menu Items</CardTitle>
              <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>
                        {item.stock === 0 ? (
                          <Badge variant="destructive">Out</Badge>
                        ) : (
                          <Badge className="bg-green-500 text-white">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteItemId(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />
            <Input
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Stock"
              value={newItem.stock}
              onChange={(e) =>
                setNewItem({ ...newItem, stock: e.target.value })
              }
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItemId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
