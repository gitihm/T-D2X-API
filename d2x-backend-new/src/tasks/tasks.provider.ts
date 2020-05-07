import { ChartGeneral, ChartSymptom, ChartProduct, ChartMonth, ChartYear, ChartOrder, ChartUser } from "../chart/model/chart.model";
import { SymptomTest } from "../symptom/model/symptom.model";
import { Product } from "../product/model/product.model";
import { DiseaseHeader } from "../disease/model/disease.model";


export const TasksProviders = [
  {
    provide: 'ChartGeneralRepo',
    useValue: ChartGeneral,
  },

  {
    provide: 'ChartSymptomRepo',
    useValue: ChartSymptom,
  },

  {
    provide: 'ChartProductRepo',
    useValue: ChartProduct,
  },
  {
    provide: 'ChartMonthRepo',
    useValue: ChartMonth,
  },

  {
    provide: 'ChartYearRepo',
    useValue: ChartYear,
  },
  {
    provide: 'ChartOrderRepo',
    useValue: ChartOrder,
  },
  {
    provide: 'ChartUserRepo',
    useValue: ChartUser,
  },
  {
    provide: 'SymptomTestRepo',
    useValue: SymptomTest,
  },
  {
    provide: 'ProductRepo', 
    useValue: Product,
  },
  {
    provide: 'diseaseheaderRepo', 
    useValue: DiseaseHeader,
  },
];
