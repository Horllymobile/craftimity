import { CreateCountryDto } from "src/resources/country/dto/create-country.dto";
import { IResponse } from "../IResponse";
import { ICountry } from "../ICountry";
import { IPagination } from "../IPagination";
import { UpdateCountryDto } from "src/resources/country/dto/update-country.dto";
export interface ICountryController {
    createCountry(createCountryDto: CreateCountryDto): Promise<IResponse<ICountry>>;
    findCountries(page: number, size: number, name?: string): Promise<IResponse<IPagination<ICountry[]>>>;
    findCountryById(id: number): Promise<IResponse<ICountry>>;
    updateCountry(id: number, updateCountryDto: UpdateCountryDto): Promise<IResponse<ICountry>>;
    deleteCountry(id: number): Promise<IResponse<ICountry>>;
}
