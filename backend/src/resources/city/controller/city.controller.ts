import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from "@nestjs/common";
import { CityService } from "../service/city.service";
import { CreateCityDto } from "../dto/create-city.dto";
import { UpdateCityDto } from "../dto/update-city.dto";
import { ApiTags } from "@nestjs/swagger";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { ICityController } from "src/core/interfaces/controllers/ICityController";
import { ICity } from "src/core/interfaces/ICity";
import { IPagination } from "src/core/interfaces/IPagination";
import { IResponse } from "src/core/interfaces/IResponse";
import { ToogleActiveDto } from "src/core/dto/dto";

@ApiTags("City")
@Controller("api/v1/cities")
export class CityController implements ICityController {
  constructor(private readonly cityService: CityService) {}

  @Post("")
  async createCity(@Body() payload: CreateCityDto): Promise<IResponse<ICity>> {
    const cities = await this.cityService.createCity(payload);
    return {
      status: EResponseStatus.SUCCESS,
      message: "Created city sucessfully",
      data: cities,
    };
  }

  @Get("")
  async findCities(
    @Query("page") page: number = 1,
    @Query("size") size: number = 10,
    @Query("name") name?: string,
    @Query("state") state_id?: number
  ): Promise<IResponse<IPagination<ICity[]>>> {
    const cities = await this.cityService.findCities(
      page,
      size,
      name,
      state_id
    );
    const total = await this.cityService.countCities();
    return {
      message: "Cities fetched successfully",
      status: EResponseStatus.SUCCESS,
      data: {
        page,
        size,
        total,
        data: cities,
      },
    };
  }

  @Get(":id")
  async findCityById(@Param("id") id: number): Promise<IResponse<ICity>> {
    const city = await this.cityService.findCityById(id);
    return {
      message: "City retrieve successfully",
      status: EResponseStatus.SUCCESS,
      data: city,
    };
  }

  @Put(":id")
  async updateCity(
    @Param("id") id: number,
    @Body() payload: UpdateCityDto
  ): Promise<IResponse<ICity>> {
    await this.cityService.updateCity(id, payload);
    return {
      message: "State updated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch(":id/activate")
  async activateCity(
    @Param("id") id: number,
    @Body() payload: ToogleActiveDto
  ): Promise<IResponse<ICity>> {
    await this.cityService.toggleActiveICity(id, payload);
    return {
      message: "City activated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch(":id/deactivate")
  async deactivateCity(
    @Param("id") id: number,
    @Body() payload: ToogleActiveDto
  ): Promise<IResponse<ICity>> {
    await this.cityService.toggleActiveICity(id, payload);
    return {
      message: "City activated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Delete(":id")
  async deleteCity(@Param("id") id: number): Promise<IResponse<ICity>> {
    await this.cityService.deleteCity(id);
    return {
      message: "City deleted successfully",
      status: EResponseStatus.SUCCESS,
    };
  }
}
