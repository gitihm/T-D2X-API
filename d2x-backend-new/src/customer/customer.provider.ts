import {  Order,OrderProduct } from './model/customer.model'
export const CustomerProviders = [
  {
    provide: 'orderProductRepo', 
    useValue: OrderProduct,
  },
  {
    provide: 'orderRepo', 
    useValue: Order,
  },
];