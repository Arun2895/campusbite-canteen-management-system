import { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Package,
  DollarSign,
  ShoppingCart,
  Trash2,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { menuItems as initialMenuItems } from '@/data/menuData';
import { MenuItem } from '@/types/canteen';
import { cn } from '@/lib/utils';

export default function Admin() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  });

  /* ================= Dynamic Stats ================= */

  const totalItemsInStock = useMemo(() => {
    return menuItems.reduce((total, item) => total + item.stock, 0);
  }, [menuItems]);

  const stats = [
    { label: 'Total Revenue', value: '$2,847.50', icon: DollarSign },
    { label: 'Orders Today', value: '156', icon: ShoppingCart },
    { label: 'Items in Stock', value: totalItemsInStock.toString(), icon: Package },
  ];

  /* ================= Add Item Logic ================= */

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.price || !newItem.stock)
      return;

    const item: MenuItem = {
      id: crypto.randomUUID(),
      name: newItem.name,
      description: `${newItem.name} - freshly prepared`,
      category: newItem.category.toLowerCase(),
      price: parseFloat(newItem.price),
      stock: parseInt(newItem.stock),
      isAvailable: parseInt(newItem.stock) > 0,
    };

    setMenuItems(prev => [...prev, item]);
    setNewItem({ name: '', category: '', price: '', stock: '' });
    setIsAddDialogOpen(false);
  };

  /* ================= Delete Item Logic ================= */

  const handleDeleteItem = () => {
    if (!deleteItemId) return;
    setMenuItems(prev => prev.filter(item => item.id !== deleteItemId));
    setDeleteItemId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ================= Header ================= */}
      <header className="sticky top-0 z-40 glass border-b">
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

        {/* ================= Stats Section ================= */}
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                      <stat.icon className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ================= Menu Management ================= */}
        <section>
          <Card className="max-w-6xl mx-auto">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Menu Items</CardTitle>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                      </TableCell>
                      <TableCell className="capitalize">
                        {item.category}
                      </TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.stock}</TableCell>
                      <TableCell>
                        {item.stock === 0 ? (
                          <Badge variant="destructive">
                            Out of Stock
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-success/10 text-success"
                          >
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteItemId(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* ================= Add Item Dialog ================= */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
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
              placeholder="Category (snacks, drinks, etc.)"
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
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= Delete Confirmation Dialog ================= */}
      <Dialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteItemId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
