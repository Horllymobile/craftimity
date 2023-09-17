import { CreateCountryDto } from "src/resources/country/dto/create-country.dto";
import { IResponse } from "../IResponse";
import { ICountry } from "../ICountry";
import { IPagination } from "../IPagination";
import { UpdateCountryDto } from "src/resources/country/dto/update-country.dto";
import { ToogleActiveDto } from "src/core/dto/dto";

export interface ICountryController {
  createCountry(payload: CreateCountryDto): Promise<IResponse<ICountry>>;

  findCountries(
    page: number,
    size: number,
    name?: string
  ): Promise<IResponse<IPagination<ICountry[]>>>;

  findCountryById(id: number): Promise<IResponse<ICountry>>;

  updateCountry(
    id: number,
    payload: UpdateCountryDto
  ): Promise<IResponse<ICountry>>;

  activateCity(
    id: number,
    payload: ToogleActiveDto
  ): Promise<IResponse<ICountry>>;

  deactivateCity(
    id: number,
    payload: ToogleActiveDto
  ): Promise<IResponse<ICountry>>;

  deleteCountry(id: number): Promise<IResponse<ICountry>>;
}
