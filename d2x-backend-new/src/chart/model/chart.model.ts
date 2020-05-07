import {
  AllowNull,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from '../../product/model/product.model';
import { SymptomTest } from 'src/symptom/model/symptom.model';
import { DiseaseHeader } from 'src/disease/model/disease.model';
@Table({
  timestamps: false,
  paranoid: false,
})
export class ChartGeneral extends Model<ChartGeneral> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  chart_general_id: number;

  @AllowNull(false)
  @Column
  date: string;

  @AllowNull(false)
  @Column
  male: number;

  @AllowNull(false)
  @Column
  female: number;

  @AllowNull(false)
  @Column
  child: number;

  @AllowNull(false)
  @Column
  adult: number;

  @AllowNull(false)
  @Column
  elderly: number;

  @AllowNull(false)
  @ForeignKey(() => DiseaseHeader)
  @Column
  disease_id: number;

  @AllowNull(false)
  @ForeignKey(() => ChartMonth)
  @Column
  chart_m_id: number;
}
@Table({
  timestamps: false,
  paranoid: false,
})
export class ChartSymptom extends Model<ChartSymptom> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  chart_symptom_id: number;

  @AllowNull(false)
  @Column
  date: string;

  @AllowNull(false)
  @ForeignKey(() => SymptomTest)
  @Column
  symptom_id: number;

  @AllowNull(false)
  @Column
  count: number;

  @AllowNull(false)
  @ForeignKey(() => DiseaseHeader)
  @Column
  disease_id: number;

  @AllowNull(false)
  @ForeignKey(() => ChartMonth)
  @Column
  chart_m_id: number;
}

@Table({
  timestamps: false,
  paranoid: false,
})
export class ChartProduct extends Model<ChartProduct> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  chart_product_id: number;

  @AllowNull(false)
  @Column
  date: string;

  @AllowNull(false)
  @ForeignKey(() => Product)
  @Column
  product_id: number;

  @AllowNull(false)
  @Column
  count: number;
  
  @AllowNull(false)
  @ForeignKey(() => DiseaseHeader)
  @Column
  disease_id: number;

  @AllowNull(false)
  @ForeignKey(() => ChartMonth)
  @Column
  chart_m_id: number;
}
@Table({
  timestamps: false,
  paranoid: false,
})
export class ChartOrder extends Model<ChartOrder> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  chart_order_id: number;

  @AllowNull(false)
  @Column
  date: string;

  @AllowNull(false)
  @Column
  count: number;

  @AllowNull(false)
  @ForeignKey(() => ChartMonth)
  @Column
  chart_m_id: number;
}
@Table({
  timestamps: false,
  paranoid: false,
})
export class ChartUser extends Model<ChartUser> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  chart_user_id: number;

  @AllowNull(false)
  @Column
  date: string;

  @AllowNull(false)
  @Column
  count: number;

  @AllowNull(false)
  @ForeignKey(() => ChartMonth)
  @Column
  chart_m_id: number;
}

@Table({
  timestamps: false,
  paranoid: false,
})
export class ChartMonth extends Model<ChartMonth> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  chart_m_id: number;

  @AllowNull(false)
  @Column
  date: string;

  @HasMany(() => ChartGeneral)
  generals: ChartGeneral[];

  @HasMany(() => ChartSymptom)
  symptoms: ChartSymptom[];

  @HasMany(() => ChartProduct)
  products: ChartProduct[];

  @AllowNull(false)
  @ForeignKey(() => ChartYear)
  @Column
  chart_y_id: number;
}

@Table({
  timestamps: false,
  paranoid: false,
})
export class ChartYear extends Model<ChartYear> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  chart_y_id: number;

  @AllowNull(false)
  @Column
  year: string;

  @HasMany(() => ChartMonth)
  data: ChartMonth[];
}
