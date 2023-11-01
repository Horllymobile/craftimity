import {
  CrateCategoryDto,
  UpdateCategoryDto,
} from "src/resources/category/dto/create-category.dto";
import { ICategory } from "../ICategory";
import { IResponse } from "../IResponse";
import { IPagination } from "../IPagination";
import { ToogleActiveDto } from "src/core/dto/dto";

export interface ICategoryController {
  createCategory(
    createCityDto: CrateCategoryDto
  ): Promise<IResponse<ICategory>>;

  findCategories(
    page: number,
    size: number,
    name?: string
  ): Promise<IResponse<IPagination<ICategory[]>>>;

  findCategoryById(id: number): Promise<IResponse<ICategory>>;

  // countCategories(): Promise<number>;

  updateCategory(
    id: number,
    updateCityDto: UpdateCategoryDto
  ): Promise<IResponse<ICategory>>;

  activateCity(
    id: number,
    payload: ToogleActiveDto
  ): Promise<IResponse<ICategory>>;

  deactivateCity(
    id: number,
    payload: ToogleActiveDto
  ): Promise<IResponse<ICategory>>;

  deleteCategory(id: number): Promise<IResponse<ICategory>>;
}
