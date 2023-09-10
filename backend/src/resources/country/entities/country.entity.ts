import {
  Table,
  Model,
  Column,
  Length,
  DataType,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

@Table
export class CountryEntity extends Model {
  @AutoIncrement
  @Column({ type: DataType.BIGINT, primaryKey: true })
  id: number;

  @Length({ max: 256 })
  @Column({ type: DataType.STRING })
  name: string;

  @Length({ max: 5, min: 2 })
  @Column({ unique: true })
  code: string;

  @Length({ max: 4, min: 1 })
  @Column({ unique: true })
  phoneCode: string;

  @Column({ unique: true })
  currency: string;

  @Length({ max: 3, min: 1 })
  @Column({ unique: true })
  currencyCode: string;

  @CreatedAt
  createdAt?: any;

  @UpdatedAt
  updatedAt?: any;

  @Column({ defaultValue: false })
  active: boolean;
}
