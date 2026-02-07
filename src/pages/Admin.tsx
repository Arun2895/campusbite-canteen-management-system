import { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Edit2,
  Trash2,
  Plus,
  AlertTriangle
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
import { menuItems as initialMenuItems } from '@/data/menuData';
import { MenuItem } from '@/types/canteen';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Revenue', value: '$2,847.50', icon: DollarSign, change: '+12%' },
  { label: 'Orders Today', value: '156', icon: ShoppingCart, change: '+8%' },
  { label: 'Items in Stock', value: '342', icon: Package, change: '-5%' },
  { label: 'Avg Order Value', value: '$18.25', icon: TrendingUp, change: '+3%' },
];

export default function Admin() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [editingStock, setEditingStock] = useState<string | null>(null);

  const lowStockItems = menuItems.filter(item => item.stock > 0 && item.stock <= 5);
  const outOfStockItems = menuItems.filter(item => item.stock === 0);

  const handleStockUpdate = (itemId: string, newStock: number) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, stock: Math.max(0, newStock), isAvailable: newStock > 0 }
          : item
      )
    );
    setEditingStock(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container flex h-16 items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/" aria-label="Back to menu">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats Grid */}
        <section aria-label="Statistics overview">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card 
                key={stat.label} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                  <p className={cn(
                    'mt-2 text-sm font-medium',
                    stat.change.startsWith('+') ? 'text-success' : 'text-destructive'
                  )}>
                    {stat.change} from yesterday
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Alerts */}
        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <section aria-label="Stock alerts">
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {outOfStockItems.length > 0 && (
                  <p className="text-sm">
                    <Badge variant="destructive" className="mr-2">{outOfStockItems.length}</Badge>
                    items are out of stock
                  </p>
                )}
                {lowStockItems.length > 0 && (
                  <p className="text-sm">
                    <Badge className="mr-2 bg-warning text-warning-foreground">{lowStockItems.length}</Badge>
                    items are running low
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Menu Management */}
        <section aria-label="Menu management">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Menu Items</CardTitle>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
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
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{item.category}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {editingStock === item.id ? (
                            <Input
                              type="number"
                              defaultValue={item.stock}
                              className="h-8 w-20"
                              onBlur={(e) => handleStockUpdate(item.id, parseInt(e.target.value) || 0)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleStockUpdate(item.id, parseInt((e.target as HTMLInputElement).value) || 0);
                                }
                                if (e.key === 'Escape') {
                                  setEditingStock(null);
                                }
                              }}
                              autoFocus
                              aria-label={`Update stock for ${item.name}`}
                            />
                          ) : (
                            <button
                              onClick={() => setEditingStock(item.id)}
                              className={cn(
                                'font-medium hover:underline',
                                item.stock === 0 && 'text-destructive',
                                item.stock > 0 && item.stock <= 5 && 'text-warning'
                              )}
                              aria-label={`Stock: ${item.stock}. Click to edit.`}
                            >
                              {item.stock}
                            </button>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.stock === 0 ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : item.stock <= 5 ? (
                            <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-success/10 text-success">In Stock</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              aria-label={`Edit ${item.name}`}
                            >
                              <Edit2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
