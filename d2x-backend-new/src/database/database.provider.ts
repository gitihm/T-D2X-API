import { Sequelize } from 'sequelize-typescript';
import { Token, Users, Disease } from '../users/model/users.model';
import { Product } from '../product/model/product.model';
import { Order, OrderProduct } from '../customer/model/customer.model';
import {
  ChartGeneral,
  ChartSymptom,
  ChartProduct,
  ChartMonth,
  ChartYear,
  ChartOrder,
  ChartUser,
} from '../chart/model/chart.model';
import { DiseaseHeader } from '../disease/model/disease.model';
import { QuestionTest, ChoiceTest } from '../question/model/questiontest.model';
import { SymptomTest, From } from '../symptom/model/symptom.model';
import { Views } from '../views/model/views.model';
import { MapProduct } from '../symptom/model/map.product.model';
import { Config } from '../config/config';

export const DatabaseProvider = [
  {
    provide: 'db',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: Config.database.host,
        port: Config.database.port,
        username: Config.database.username,
        password: Config.database.password,
        database: Config.database.database,
      });
      sequelize.addModels([
        Users,
        Product,
        Order,
        OrderProduct,
        Disease,
        Token,
        ChartGeneral,
        ChartSymptom,
        ChartProduct,
        ChartMonth,
        ChartYear,
        ChartOrder,
        ChartUser,
        DiseaseHeader,
        QuestionTest,
        ChoiceTest,
        SymptomTest,
        From,
        Views,
        MapProduct,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
