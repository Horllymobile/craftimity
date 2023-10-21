import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { CategoryService } from "../service/category.service";
import { ToogleActiveDto } from "src/core/dto/dto";
import { IPagination } from "src/core/interfaces/IPagination";
import { IResponse } from "src/core/interfaces/IResponse";
import { ApiTags } from "@nestjs/swagger";
import {
  CrateCategoryDto,
  UpdateCategoryDto,
} from "../dto/create-category.dto";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { ICategoryController } from "src/core/interfaces/controllers/ICategoryController";
import { ICategory } from "src/core/interfaces/ICategory";

@ApiTags("Category")
@Controller(`api/v1/categories`)
export class CategoryController implements ICategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() payload: CrateCategoryDto
  ): Promise<IResponse<ICategory>> {
    const category = await this.categoryService.createCategory(payload);
    return {
      status: EResponseStatus.SUCCESS,
      message: "Created category sucessfully",
      data: category,
    };
  }

  @Get()
  async findCategories(
    @Query("page") page: number = 1,
    @Query("size") size: number = 20,
    @Query("name") name?: string
  ): Promise<IResponse<IPagination<ICategory[]>>> {
    const categories = await this.categoryService.findCategories(
      page,
      size,
      name
    );
    const total = await this.categoryService.countCategories();
    return {
      message: "Categories fetched successfully",
      status: EResponseStatus.SUCCESS,
      data: {
        page,
        size,
        total,
        data: categories,
      },
    };
  }
  @Get(":id")
  async findCategoryById(
    @Param("id") id: number
  ): Promise<IResponse<ICategory>> {
    const category = await this.categoryService.findCategoryById(id);
    return {
      message: "Category retrieve successfully",
      status: EResponseStatus.SUCCESS,
      data: category,
    };
  }

  @Put(":id")
  async updateCategory(
    @Param("id") id: number,
    @Body() payload: UpdateCategoryDto
  ): Promise<IResponse<ICategory>> {
    await this.categoryService.updateCategory(id, payload);
    return {
      message: "Country updated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch(":id/activate")
  async activateCity(
    @Param("id") id: number,
    @Body() payload: ToogleActiveDto
  ): Promise<IResponse<ICategory>> {
    await this.categoryService.toggleActiveICategory(id, payload);
    return {
      message: "Category activated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }
  @Patch(":id/deactivate")
  async deactivateCity(
    @Param("id") id: number,
    @Body() payload: ToogleActiveDto
  ): Promise<IResponse<ICategory>> {
    await this.categoryService.toggleActiveICategory(id, payload);
    return {
      message: "Category deactivated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Delete(":id")
  async deleteCategory(@Param("id") id: number): Promise<IResponse<ICategory>> {
    await this.categoryService.deleteCategory(id);
    return {
      message: "Country deleted successfully",
      status: EResponseStatus.SUCCESS,
    };
  }
}
