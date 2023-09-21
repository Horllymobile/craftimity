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
import { CountryService } from "../service/country.service";
import { CreateCountryDto } from "../dto/create-country.dto";
import { UpdateCountryDto } from "../dto/update-country.dto";
import { ICountryController } from "src/core/interfaces/controllers/ICountryController";
import { IResponse } from "src/core/interfaces/IResponse";
import { ICountry } from "src/core/interfaces/ICountry";
import { IPagination } from "src/core/interfaces/IPagination";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { ToogleActiveDto } from "../../../core/dto/dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Country")
@Controller(`api/v1/countries`)
export class CountryController implements ICountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  async createCountry(
    @Body() payload: CreateCountryDto
  ): Promise<IResponse<ICountry>> {
    const country = await this.countryService.createCountry(payload);
    return {
      status: EResponseStatus.SUCCESS,
      message: "Created country sucessfully",
      data: country,
    };
  }

  @Get()
  async findCountries(
    @Query("page") page: number,
    @Query("size") size: number,
    @Query("name") name?: string
  ): Promise<IResponse<IPagination<ICountry[]>>> {
    const countries = await this.countryService.findCountries(page, size, name);
    const total = await this.countryService.countCountries();
    return {
      message: "Countries fetched successfully",
      status: EResponseStatus.SUCCESS,
      data: {
        page,
        size,
        total,
        data: countries,
      },
    };
  }

  @Get(":id")
  async findCountryById(@Param("id") id: number): Promise<IResponse<ICountry>> {
    const country = await this.countryService.findCountryById(id);
    return {
      message: "Country retrieve successfully",
      status: EResponseStatus.SUCCESS,
      data: country,
    };
  }

  @Put(":id")
  async updateCountry(
    @Param("id") id: number,
    @Body() payload: UpdateCountryDto
  ): Promise<IResponse<ICountry>> {
    await this.countryService.updateCountry(id, payload);
    return {
      message: "Country updated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch(":id/activate")
  async activateCity(
    @Param("id") id: number,
    @Body() payload: ToogleActiveDto
  ): Promise<IResponse<ICountry>> {
    await this.countryService.toggleActiveICountry(id, payload);
    return {
      message: "Country activated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch(":id/deactivate")
  async deactivateCity(
    @Param("id") id: number,
    @Body() payload: ToogleActiveDto
  ): Promise<IResponse<ICountry>> {
    await this.countryService.toggleActiveICountry(id, payload);
    return {
      message: "Country deactivated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Delete(":id")
  async deleteCountry(@Param("id") id: number): Promise<IResponse<ICountry>> {
    await this.countryService.deleteCountry(id);
    return {
      message: "Country deleted successfully",
      status: EResponseStatus.SUCCESS,
    };
  }
}
