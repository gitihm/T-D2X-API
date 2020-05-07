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
export class Users extends Model<Users> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  user_id: number;

  @AllowNull(false)
  @Unique
  @Column
  username: string;

  @AllowNull(true)
  @Unique
  @Column
  photo: string;

  @AllowNull(false)
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(true)
  @Column
  fname: string;

  @AllowNull(true)
  @Column
  lname: string;

  @AllowNull(true)
  @Column
  address: string;

  @AllowNull(true)
  @Column
  phoneNumber: string;

  @AllowNull(true)
  @Column
  role: number;

  @HasMany(() => Disease)
  diseases: Disease[];

  @HasMany(() => Token)
  accessTokens: Token[];
}
@Table({
  timestamps: false,
  paranoid: false,
})
export class Disease extends Model<Disease> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  disease_id: number;

  @AllowNull(false)
  @Column
  disease: string;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  user_id: number;
}
@Table({
  timestamps: false,
  paranoid: false,
})
export class Token extends Model<Token> {
  @AllowNull(false)
  @PrimaryKey
  @AutoIncrement
  @Column
  token_id: number;

  @AllowNull(false)
  @Column
  token: string;

  @AllowNull(false)
  @ForeignKey(() => Users)
  @Column
  user_id: number;
}
