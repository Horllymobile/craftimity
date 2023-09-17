import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateCityDto } from "../dto/create-city.dto";
import { UpdateCityDto } from "../dto/update-city.dto";
import { ICityService } from "src/core/interfaces/services/ICityService";
import { ICity } from "src/core/interfaces/ICity";
import { IResponse } from "src/core/interfaces/IResponse";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { EResponseStatus } from "src/core/enums/ResponseStatus";

@Injectable()
export class CityService implements ICityService {
  private readonly logger = new Logger(CityService.name);
  constructor(private readonly superBaseService: SuperbaseService) {}

  createCity(createCityDto: CreateCityDto): Promise<ICity> {
    throw new Error("Method not implemented.");
  }
  findCities(page: number, size: number, name?: string): Promise<ICity[]> {
    throw new Error("Method not implemented.");
  }
  findCityById(id: number): Promise<ICity> {
    throw new Error("Method not implemented.");
  }
  countCities(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  updateCity(id: number, updateCityDto: UpdateCityDto): Promise<ICity> {
    throw new Error("Method not implemented.");
  }
  async toggleActiveICity(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<ICity>> {
    let res = await this.superBaseService
      .connect()
      .from("City")
      .select("*")
      .eq("id", id)
      .single();
    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "City not found",
      });

    res = await this.superBaseService
      .connect()
      .from("City")
      .update({ active: payload.activate })
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }
  deleteCity(id: number): Promise<ICity> {
    throw new Error("Method not implemented.");
  }
}
