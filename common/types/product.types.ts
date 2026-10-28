export type Product = {
  id?: string;
  name: string;
  japaneseName: string;
  description: string;
  category: string;
  allergens: string[];
  position?: number;
  pieces: number;
  price: number;
  status?: boolean;
};

export type Page<Product> = {
  content: Product[];
  totalPages: number;
  number: number;
}
