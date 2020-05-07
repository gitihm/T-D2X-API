import { SymptomTest } from "../symptom/model/symptom.model";
import { QuestionTest, ChoiceTest } from "../question/model/questiontest.model";
import { MapProduct } from '../symptom/model/map.product.model';
import { Product } from "../product/model/product.model";
export const ConcludeProviders = [
  
  {
    provide: 'SymptomTestRepo', 
    useValue: SymptomTest,
  },
  {
    provide: 'choiceRepo',
    useValue: ChoiceTest,
  },
  {
    provide: 'questionRepo',
    useValue: QuestionTest,
  },
  {
    provide : 'mapProductRepo',
    useValue : MapProduct
 
  },
  {
    provide: 'productRepo', 
    useValue: Product,
  },

];