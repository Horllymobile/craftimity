import { CreateCityDto } from "src/resources/city/dto/create-city.dto";
import { ICity } from "../ICity";
import { UpdateCityDto } from "src/resources/city/dto/update-city.dto";
import { IResponse } from "../IResponse";

export interface ICityService {
  createCity(createCityDto: CreateCityDto): Promise<ICity>;

  findCities(page: number, size: number, name?: string): Promise<ICity[]>;

  findCityById(id: number): Promise<ICity>;

  countCities(): Promise<number>;

  updateCity(id: number, updateCityDto: UpdateCityDto): Promise<ICity>;

  toggleActiveICity(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<ICity>>;

  deleteCity(id: number): Promise<ICity>;
}
