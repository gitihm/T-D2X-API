import {
    AllowNull,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    Table,
    Unique,
    HasMany,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  @Table({
    timestamps: true,
    paranoid: true,
  })
  export class Views extends Model<Views> {
    @AllowNull(false)
    @PrimaryKey
    @Column
    ip: string;
  }
  
  