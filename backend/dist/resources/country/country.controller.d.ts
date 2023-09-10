import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    create(createCountryDto: CreateCountryDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCountryDto: UpdateCountryDto): string;
    remove(id: string): string;
}
