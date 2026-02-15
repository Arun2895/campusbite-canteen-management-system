export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string | null;
  stock: number;
  is_available: boolean;
  created_at?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  counterNumber: number;
  createdAt: Date;
  customerName: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
