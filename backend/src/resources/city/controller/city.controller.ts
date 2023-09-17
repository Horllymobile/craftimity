import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CityService } from "../service/city.service";
import { CreateCityDto } from "../dto/create-city.dto";
import { UpdateCityDto } from "../dto/update-city.dto";

@Controller("api/v1/cities")
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.createCity(createCityDto);
  }

  @Get()
  findAll(
    @Query("page") page: number = 1,
    @Query("size") size: number = 10,
    @Query("name") name?: string,
    @Query("state") state_id?: number
  ) {
    return this.cityService.findCities(page, size, name);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.cityService.findCityById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.cityService.updateCity(+id, updateCityDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.cityService.deleteCity(+id);
  }
}
