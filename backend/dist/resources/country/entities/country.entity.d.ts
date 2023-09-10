import { Model } from "sequelize-typescript";
export declare class CountryEntity extends Model {
    id: number;
    name: string;
    code: string;
    phoneCode: string;
    currency: string;
    currencyCode: string;
    createdAt?: any;
    updatedAt?: any;
    active: boolean;
}
