import { Model } from "sequelize-typescript";
import { StateEntity } from "src/resources/state/entities/state.entity";
export declare class CountryEntity extends Model {
    id: number;
    name: string;
    code: string;
    phoneCode: string;
    currency: string;
    currencyCode: string;
    createdAt?: string;
    updatedAt?: string;
    active: boolean;
    states: StateEntity[];
}
