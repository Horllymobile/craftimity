import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from "@nestjs/common";
import { ServiceService } from "../service/service.service";
import { CreateServiceDto } from "../dto/create-service.dto";
import { UpdateServiceDto } from "../dto/update-service.dto";
import { AuthGuard } from "src/core/guards/auth.guard";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { Request } from "express";
import { Roles } from "src/core/decorators/role.decorator";
import { ERole } from "src/core/enums/Role";

@Controller("api/v1/services")
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @UseGuards(AuthGuard)
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN, ERole.CRAFTMAN)
  @Post()
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Req() req: Request
  ) {
    const user = req["user"];
    await this.serviceService.create(createServiceDto, user);
    return {
      message: "Services created successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Get()
  async findAll(
    page: number = 1,
    size: number = 20,
    status: "active" | "inactive" = "active",
    country?: number,
    name?: string
  ) {
    const services = await this.serviceService.findAll({
      page,
      size,
      country,
      status,
      name,
    });
    const total = await this.serviceService.countServices();
    return {
      message: "Categories fetched successfully",
      status: EResponseStatus.SUCCESS,
      data: {
        page,
        size,
        total,
        data: services,
      },
    };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const service = await this.serviceService.findById(+id);
    return {
      message: "Service retrieved successfully",
      data: service,
      status: EResponseStatus.SUCCESS,
    };
  }

  @UseGuards(AuthGuard)
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN, ERole.CRAFTMAN)
  @Put(":id")
  async update(@Param("id") id: string, @Body() payload: UpdateServiceDto) {
    await this.serviceService.update(+id, payload);
    return {
      message: "Service updated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @UseGuards(AuthGuard)
  @Roles(ERole.ADMIN, ERole.SUPER_ADMIN, ERole.CRAFTMAN)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.serviceService.remove(+id);
    return {
      message: "Service deleted successfully",
      status: EResponseStatus.SUCCESS,
    };
  }
}
