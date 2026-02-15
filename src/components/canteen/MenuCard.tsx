import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { MenuItem } from '@/types/canteen';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

function CategoryEmoji({ category }: { category: string | null }) {
  if (category === 'breakfast') return <>🍳</>;
  if (category === 'main') return <>🍛</>;
  if (category === 'snacks') return <>🍟</>;
  if (category === 'beverages') return <>🥤</>;
  if (category === 'desserts') return <>🍰</>;
  return <>🍽️</>;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isLowStock = item.stock > 0 && item.stock <= 5;
  const isOutOfStock = item.stock === 0 || !item.is_available;
  const showImage = item.image_url && item.image_url.trim() !== '' && !imageFailed;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl bg-card p-4 shadow-card transition-smooth hover:shadow-lg',
        isOutOfStock && 'opacity-60'
      )}
      aria-label={`${item.name}, ₹${item.price.toFixed(2)}${isOutOfStock ? ', out of stock' : ''}`}
    >
      {/* Image or placeholder */}
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        {showImage ? (
          <img
            src={item.image_url!}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              console.error(`Failed to load image for ${item.name}:`, item.image_url);
              e.currentTarget.style.display = 'none'; // Ensure broken image icon is hidden
              setImageFailed(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl bg-muted/50">
            <CategoryEmoji category={item.category} />
          </div>
        )}
        
        {/* Stock badge */}
        {isOutOfStock && (
          <Badge 
            variant="destructive" 
            className="absolute left-2 top-2 gap-1"
            aria-label="Out of stock"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            Out of Stock
          </Badge>
        )}
        {isLowStock && !isOutOfStock && (
          <Badge 
            className="absolute left-2 top-2 bg-warning text-warning-foreground"
            aria-label={`Only ${item.stock} left`}
          >
            Only {item.stock} left
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <h3 className="font-semibold text-card-foreground line-clamp-1">
          {item.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-primary" aria-label={`Price: ₹${item.price.toFixed(2)}`}>
            ₹{item.price.toFixed(2)}
          </span>
          
          <Button
            size="icon"
            className="h-9 w-9 rounded-full shadow-soft transition-smooth"
            onClick={() => onAddToCart(item)}
            disabled={isOutOfStock}
            aria-label={`Add ${item.name} to cart`}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}
