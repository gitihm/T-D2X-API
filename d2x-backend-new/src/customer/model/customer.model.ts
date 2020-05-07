import {
  AllowNull,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  Table,
  ForeignKey,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
@Table({
  timestamps: true,
  paranoid: true,
})
export class Order extends Model<Order> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  order_id: number;

  @AllowNull(false)
  @Column
  order: string;

  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  phonenumber: string;

  @AllowNull(false)
  @Column
  photo: string;

  @AllowNull(false)
  @Column
  statusorder: number;

  @AllowNull(false)
  @Column
  statususer: number;

  @AllowNull(false)
  @Column
  delivery: number;

  @AllowNull(false)
  @Column
  address: string;

  @HasMany(() => OrderProduct)
  products: OrderProduct[];

  @AllowNull(false)
  @Column
  allprice: number;
}
@Table({
    timestamps: false,
    paranoid: false,
  })
export class OrderProduct extends Model<OrderProduct> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  product_id: number;

  @AllowNull(false)
  @Column
  photo: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  count: number;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Column
  order_id: number;

  @AllowNull(false)
  @Column
  price: number;
}
