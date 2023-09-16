import {
  Table,
  Model,
  Column,
  Length,
  DataType,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";
import { CityEntity } from "src/resources/city/entities/city.entity";
import { CountryEntity } from "src/resources/country/entities/country.entity";

@Table
export class StateEntity extends Model {
  @AutoIncrement
  @Column({ type: DataType.BIGINT, primaryKey: true })
  id: number;

  @Length({ max: 256 })
  @Column({ type: DataType.STRING })
  name: string;

  @Column({ defaultValue: false })
  active: boolean;

  @CreatedAt
  createdAt?: string;

  @UpdatedAt
  updatedAt?: string;

  @ForeignKey(() => CountryEntity)
  @Column
  countryId: number;

  @BelongsTo(() => CountryEntity)
  country: CountryEntity;

  @HasMany(() => CityEntity)
  states: CityEntity[];
}
