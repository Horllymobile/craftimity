import { CountryService } from "../service/country.service";
import { CreateCountryDto } from "../dto/create-country.dto";
import { UpdateCountryDto } from "../dto/update-country.dto";
import { ICountryController } from "src/core/interfaces/controllers/ICountryController";
import { IResponse } from "src/core/interfaces/IResponse";
import { ICountry } from "src/core/interfaces/ICountry";
import { IPagination } from "src/core/interfaces/IPagination";
export declare class CountryController implements ICountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    createCountry(payload: CreateCountryDto): Promise<IResponse<ICountry>>;
    findCountries(page: number, size: number, name?: string): Promise<IResponse<IPagination<ICountry[]>>>;
    findCountryById(id: number): Promise<IResponse<ICountry>>;
    updateCountry(id: number, updateCountryDto: UpdateCountryDto): Promise<IResponse<ICountry>>;
    deleteCountry(id: number): Promise<IResponse<ICountry>>;
}
