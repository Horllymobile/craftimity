import { Model } from "sequelize-typescript";
import { StateEntity } from "src/resources/state/entities/state.entity";
export declare class CityEntity extends Model {
    id: number;
    name: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
    stateId: number;
    country: StateEntity;
}
