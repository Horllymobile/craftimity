import {
  CrateCategoryDto,
  UpdateCategoryDto,
} from "src/resources/category/dto/create-category.dto";
import { ICategory } from "../ICategory";
import { IResponse } from "../IResponse";

export interface ICategoryService {
  createCategory(createCityDto: CrateCategoryDto): Promise<ICategory>;

  findCategories(
    page: number,
    size: number,
    name?: string
  ): Promise<ICategory[]>;

  findCategoryById(id: number): Promise<ICategory>;

  countCategories(): Promise<number>;

  updateCategory(
    id: number,
    updateCityDto: UpdateCategoryDto
  ): Promise<ICategory>;

  toggleActiveICategory(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<ICategory>>;

  deleteCategory(id: number): Promise<ICategory>;
}
