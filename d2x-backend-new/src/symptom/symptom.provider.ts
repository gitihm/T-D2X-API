import { SymptomTest, From } from './model/symptom.model'
import { MapProduct } from './model/map.product.model';
import { ChartSymptom } from '../chart/model/chart.model';
export const SymptomProviders = [
  {
    provide: 'symptomRepo',
    useValue: SymptomTest,
  },
  {
    provide: 'fromRepo',
    useValue: From,
  },
 {
   provide : 'mapProductRepo',
   useValue : MapProduct

 },
 {
  provide: 'ChartSymptomRepo',
  useValue: ChartSymptom,
},
];