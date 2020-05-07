import { Product } from '../product/model/product.model'
export const ProductProviders = [
  {
    provide: 'productRepo', 
    useValue: Product,
  },
];