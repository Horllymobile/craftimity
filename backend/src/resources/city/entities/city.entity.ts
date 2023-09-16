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
} from "sequelize-typescript";
import { StateEntity } from "src/resources/state/entities/state.entity";

@Table
export class CityEntity extends Model {
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

  @ForeignKey(() => StateEntity)
  @Column
  stateId: number;

  @BelongsTo(() => StateEntity)
  country: StateEntity;
}
