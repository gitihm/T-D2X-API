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
  export class MapProduct extends Model<MapProduct> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    map_id: number;
  
    @AllowNull(false)
    @Column
    symptom_id: number;
    
    @AllowNull(false)
    @Column
    product_id:number


    @AllowNull(false)
    @Column
    disease_id:number
  }
  