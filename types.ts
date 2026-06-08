export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  effect: string;
}

export interface CartItem extends Product {
  quantity: number;
}
