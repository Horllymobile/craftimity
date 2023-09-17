import { CreateCountryDto } from "../dto/create-country.dto";
import { UpdateCountryDto } from "../dto/update-country.dto";
import { ICountry } from "src/core/interfaces/ICountry";
import { ICountryService } from "src/core/interfaces/services/ICountryService";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { IResponse } from "src/core/interfaces/IResponse";
export declare class CountryService implements ICountryService {
    private readonly superBaseService;
    private readonly logger;
    constructor(superBaseService: SuperbaseService);
    createCountry(payload: CreateCountryDto): Promise<ICountry>;
    findCountries(page?: number, size?: number, name?: string): Promise<ICountry[]>;
    countCountries(): Promise<number>;
    findCountryById(id: number): Promise<ICountry>;
    updateCountry(id: number, payload: UpdateCountryDto): Promise<ICountry>;
    toggleActiveICountry(id: number, payload: {
        activate: boolean;
    }): Promise<IResponse<ICountry>>;
    deleteCountry(id: number): Promise<ICountry>;
}
