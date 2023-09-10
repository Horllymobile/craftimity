import { CreateCountryDto } from "../dto/create-country.dto";
import { UpdateCountryDto } from "../dto/update-country.dto";
import { ICountry } from "src/core/interfaces/ICountry";
import { CountryEntity } from "../entities/country.entity";
import { ICountryService } from "src/core/interfaces/services/ICountryService";
export declare class CountryService implements ICountryService {
    private countryRepository;
    constructor(countryRepository: typeof CountryEntity);
    createCountry(payload: CreateCountryDto): Promise<ICountry>;
    findCountries(page: number, size: number, name?: string): Promise<ICountry[]>;
    countCountries(): Promise<number>;
    findCountryById(id: number): Promise<ICountry>;
    updateCountry(id: number, updateCountryDto: UpdateCountryDto): Promise<ICountry>;
    deleteCountry(id: number): Promise<ICountry>;
}
