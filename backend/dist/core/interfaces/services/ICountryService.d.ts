import { CreateCountryDto } from "src/resources/country/dto/create-country.dto";
import { ICountry } from "../ICountry";
import { UpdateCountryDto } from "src/resources/country/dto/update-country.dto";
import { IResponse } from "../IResponse";
export interface ICountryService {
    createCountry(createCountryDto: CreateCountryDto): Promise<ICountry>;
    findCountries(page: number, size: number, name?: string): Promise<ICountry[]>;
    findCountryById(id: number): Promise<ICountry>;
    countCountries(): Promise<number>;
    updateCountry(id: number, updateCountryDto: UpdateCountryDto): Promise<ICountry>;
    toggleActiveICountry(id: number, payload: {
        activate: boolean;
    }): Promise<IResponse<ICountry>>;
    deleteCountry(id: number): Promise<ICountry>;
}
