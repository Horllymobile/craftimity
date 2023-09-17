import { CountryService } from "../service/country.service";
import { CreateCountryDto } from "../dto/create-country.dto";
import { UpdateCountryDto } from "../dto/update-country.dto";
import { ICountryController } from "src/core/interfaces/controllers/ICountryController";
import { IResponse } from "src/core/interfaces/IResponse";
import { ICountry } from "src/core/interfaces/ICountry";
import { IPagination } from "src/core/interfaces/IPagination";
import { ToogleActiveDto } from "../../../core/dto/dto";
export declare class CountryController implements ICountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    createCountry(payload: CreateCountryDto): Promise<IResponse<ICountry>>;
    findCountries(page: number, size: number, name?: string): Promise<IResponse<IPagination<ICountry[]>>>;
    findCountryById(id: number): Promise<IResponse<ICountry>>;
    updateCountry(id: number, payload: UpdateCountryDto): Promise<IResponse<ICountry>>;
    activateCity(id: number, payload: ToogleActiveDto): Promise<IResponse<ICountry>>;
    deactivateCity(id: number, payload: ToogleActiveDto): Promise<IResponse<ICountry>>;
    deleteCountry(id: number): Promise<IResponse<ICountry>>;
}
