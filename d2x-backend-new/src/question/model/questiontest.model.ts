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
import { DiseaseHeader } from '../../disease/model/disease.model';
@Table({ timestamps: false, paranoid: false })
export class QuestionTest extends Model<QuestionTest> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  question_id: number;

  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Column
  list_id: number;

  @AllowNull(false)
  @Column
  step: string;

  @HasMany(() => ChoiceTest)
  choices: ChoiceTest[];

  @AllowNull(false)
  @ForeignKey(() => DiseaseHeader)
  @Column
  disease_id: number;
  
}

@Table({ timestamps: false, paranoid: false })
export class ChoiceTest extends Model<ChoiceTest> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  chioce_id: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  link: string;

  @AllowNull(false)
  @ForeignKey(() => QuestionTest)
  @Column
  question_id: number;
  
  @AllowNull(true)
  @Column
  history: string;

  @AllowNull(false)
  @Column
  list_id: number;

  @AllowNull(false)
  @Column
  id: number;
}
