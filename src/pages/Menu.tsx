import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/canteen/Header';
import { CategoryFilter } from '@/components/canteen/CategoryFilter';
import { MenuCard } from '@/components/canteen/MenuCard';
import { CartSheet } from '@/components/canteen/CartSheet';
import { OrderConfirmation } from '@/components/canteen/OrderConfirmation';
import { useCart } from '@/context/CartContext';
import { categories, menuItems } from '@/data/menuData';
import { Order } from '@/types/canteen';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<Order | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { addItem, items, total, clearCart } = useCart();

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCheckout = () => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...items],
      total,
      status: 'pending',
      counterNumber: Math.floor(Math.random() * 20) + 1,
      createdAt: new Date(),
    };
    
    setOrderConfirmation(order);
    setShowConfirmation(true);
    clearCart();
  };

  const handleNewOrder = () => {
    setShowConfirmation(false);
    setOrderConfirmation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} />

      <main id="main-content" className="container py-6">
        {/* Hero section */}
        <section className="mb-8" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="text-3xl font-bold text-balance md:text-4xl">
            What would you like to eat{' '}
            <span className="text-gradient">today?</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Order ahead and skip the queue
          </p>
        </section>

        {/* Search */}
        <div className="relative mb-6">
          <Search 
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" 
            aria-hidden="true" 
          />
          <Input
            type="search"
            placeholder="Search for dishes..."
            className="h-12 rounded-xl pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search menu items"
          />
        </div>

        {/* Categories */}
        <section className="mb-6" aria-label="Menu categories">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        {/* Menu grid */}
        <section 
          id={`category-${activeCategory}`}
          aria-label="Menu items"
          role="tabpanel"
        >
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg font-medium">No items found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or category filter
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <MenuCard item={item} onAddToCart={addItem} />
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
