import { DiseaseHeader } from './model/disease.model';
import { QuestionTest } from '../question/model/questiontest.model';
import { From } from '../symptom/model/symptom.model';

export const DiseaseProviders = [
  {
    provide: 'diseaseheaderRepo',
    useValue: DiseaseHeader,
  },
  {
    provide: 'questionTestRepo',
    useValue: QuestionTest,
  },
  {
    provide: 'fromRepo',
    useValue: From,
  },
];
