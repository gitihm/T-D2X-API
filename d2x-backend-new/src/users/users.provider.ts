import { Users, Token, Disease } from './model/users.model'
export const UsersProviders = [
  {
    provide: 'UsersRepo',
    useValue: Users,
  },
  {
    provide: 'TokenRepo',
    useValue: Token,
  },
  {
    provide: 'DiseaseRepo',
    useValue: Disease,
  }

];