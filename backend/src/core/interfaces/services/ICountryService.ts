import { CreateCountryDto } from "src/resources/country/dto/create-country.dto";
import { ICountry } from "../ICountry";
import { UpdateCountryDto } from "src/resources/country/dto/update-country.dto";

export interface ICountryService {
  createCountry(createCountryDto: CreateCountryDto): Promise<ICountry>;

  findCountries(page: number, size: number, name?: string): Promise<ICountry[]>;

  findCountryById(id: number): Promise<ICountry>;

  countCountries(): Promise<number>;

  updateCountry(
    id: number,
    updateCountryDto: UpdateCountryDto
  ): Promise<ICountry>;

  deleteCountry(id: number): Promise<ICountry>;
}
