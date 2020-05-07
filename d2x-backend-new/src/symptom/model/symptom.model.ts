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
@Table({ timestamps: false, paranoid: false })
export class SymptomTest extends Model<SymptomTest> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  symptom_id: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  suggestion: string;

  
  
  @AllowNull(false)
  @Column
  disease_id: number;
}

@Table({ timestamps: false, paranoid: false })
export class From extends Model<From> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  from_id: number;

  @AllowNull(false)
  @Column
  choice: string;

  @AllowNull(false)
  @Column
  disease_id: number;
}
