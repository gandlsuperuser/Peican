export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  ingredients: string[];
  prepTime: string;
  calories: string;
  batchNumber: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
