import { QuestionTest,ChoiceTest } from './model/questiontest.model'
import { DiseaseHeader } from '../disease/model/disease.model';
export const QuestionTestProviders = [
  {
    provide: 'questionRepo',
    useValue: QuestionTest,
  },
  {
    provide: 'choiceRepo',
    useValue: ChoiceTest,
  },
  {
    provide: 'diseaseheaderRepo', 
    useValue: DiseaseHeader,
  },
  
];