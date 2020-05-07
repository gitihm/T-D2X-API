import { Views } from "./model/views.model";

export const ViewsProviders = [
  {
    provide: 'viewsRepo',
    useValue: Views,
  },
 
];