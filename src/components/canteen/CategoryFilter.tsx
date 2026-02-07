import { Category } from '@/types/canteen';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <nav 
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" 
      aria-label="Menu categories"
      role="tablist"
    >
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? 'default' : 'secondary'}
          className={cn(
            'flex-shrink-0 gap-2 rounded-full transition-smooth',
            activeCategory === category.id && 'shadow-soft'
          )}
          onClick={() => onCategoryChange(category.id)}
          role="tab"
          aria-selected={activeCategory === category.id}
          aria-controls={`category-${category.id}`}
        >
          <span aria-hidden="true">{category.icon}</span>
          <span>{category.name}</span>
        </Button>
      ))}
    </nav>
  );
}
