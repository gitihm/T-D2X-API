import {
    AllowNull,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    Table,
    HasMany,
    ForeignKey,
    BelongsToMany
    
  } from 'sequelize-typescript';

  @Table({
    timestamps: true,
    paranoid: true,
  })
  export class Product extends Model<Product> {
    @AllowNull(false)
    @PrimaryKey
    @AutoIncrement
    @Column
    product_id: number;
  
    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Column
    photo: string;

    @AllowNull(false)
    @Column
    sold: number;

    @AllowNull(false)
    @Column
    price: number;
    
    @AllowNull(true)
    @Column
    help: string;

    @AllowNull(false)
    @Column
    description: string;


    @AllowNull(false)
    @Column
    category: string;

    @AllowNull(false)
    @Column
    quantity: string;

    @AllowNull(false)
    @Column
    company: string;

    @AllowNull(true)
    @Column
    disease_id: number;


  
  }
  
 
  
  
  
  