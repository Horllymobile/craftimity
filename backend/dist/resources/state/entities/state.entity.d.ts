import { Model } from "sequelize-typescript";
import { CityEntity } from "src/resources/city/entities/city.entity";
import { CountryEntity } from "src/resources/country/entities/country.entity";
export declare class StateEntity extends Model {
    id: number;
    name: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
    countryId: number;
    country: CountryEntity;
    states: CityEntity[];
}
