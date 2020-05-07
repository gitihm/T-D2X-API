import {
    AllowNull,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    Table,
    ForeignKey,
    BelongsToMany,
    HasMany
    
  } from 'sequelize-typescript';
import { QuestionTest } from '../../question/model/questiontest.model';
  @Table({
    timestamps: false,
    paranoid: false,
  })
  export class DiseaseHeader extends Model<DiseaseHeader> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    disease_id: number;

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Column
    status: number;

    @HasMany(()=>QuestionTest)
    questions  : QuestionTest[];



  }
  
  
  
  