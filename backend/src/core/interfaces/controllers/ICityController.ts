import { IResponse } from "../IResponse";
import { IPagination } from "../IPagination";
import { CreateCityDto } from "src/resources/city/dto/create-city.dto";
import { UpdateCityDto } from "src/resources/city/dto/update-city.dto";
import { ICity } from "../ICity";

export interface ICityController {
  createCity(payload: CreateCityDto): Promise<IResponse<ICity>>;

  findCities(
    page: number,
    size: number,
    name?: string,
    state_id?: number
  ): Promise<IResponse<IPagination<ICity[]>>>;

  findCityById(id: number): Promise<IResponse<ICity>>;

  updateCity(id: number, payload: UpdateCityDto): Promise<IResponse<ICity>>;

  activateCity(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<ICity>>;

  deactivateCity(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<ICity>>;

  deleteCity(id: number): Promise<IResponse<ICity>>;
}
