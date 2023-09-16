import {
  Table,
  Model,
  Column,
  Length,
  DataType,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from "sequelize-typescript";
import { StateEntity } from "src/resources/state/entities/state.entity";

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
  createdAt?: string;

  @UpdatedAt
  updatedAt?: string;

  @Column({ defaultValue: false })
  active: boolean;

  @HasMany(() => StateEntity)
  states: StateEntity[];
}
