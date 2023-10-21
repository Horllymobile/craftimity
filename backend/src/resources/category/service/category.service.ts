import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ICategory } from "src/core/interfaces/ICategory";
import { IResponse } from "src/core/interfaces/IResponse";
import { ICategoryService } from "src/core/interfaces/services/ICategoryService";
import {
  CrateCategoryDto,
  UpdateCategoryDto,
} from "../dto/create-category.dto";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { EResponseStatus } from "src/core/enums/ResponseStatus";

@Injectable()
export class CategoryService implements ICategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(private readonly superBaseService: SuperbaseService) {}

  async createCategory(payload: CrateCategoryDto): Promise<ICategory> {
    let res = await this.superBaseService
      .connect()
      .from("category")
      .select("*")
      .eq("name", payload.name)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "Category already exist",
      });

    res = await this.superBaseService.connect().from("category").insert({
      name: payload.name,
      icon: payload.icon,
      is_active: payload.is_active,
    });

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }

  async findCategories(
    page: number,
    size: number,
    name?: string
  ): Promise<ICategory[]> {
    page = page <= 1 ? 0 : page;
    if (name) {
      let { data, error }: { data: ICategory[]; error: any } =
        await this.superBaseService
          .connect()
          .from("category")
          .select("id, name, icon, created_by, created_at, updated_at")
          .ilike("name", `%${name}%`)
          .limit(size)
          .order("id", { ascending: true })
          .range(page, size);

      if (error) {
        this.logger.error(error);
      }
      return data ?? [];
    }
    let { data, error }: { data: ICategory[]; error: any } =
      await this.superBaseService
        .connect()
        .from("category")
        .select("id, name, icon, created_by, created_at, updated_at")
        .limit(size)
        .order("id", { ascending: true })
        .range(page, size);

    if (error) {
      this.logger.error(error);
    }
    return data ?? [];
  }

  async findCategoryById(id: number): Promise<ICategory> {
    let res = await this.superBaseService
      .connect()
      .from("category")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "Category not found",
      });
    return res.data;
  }

  async countCategories(): Promise<number> {
    let { data, count }: { data: ICategory[]; count: number } =
      await this.superBaseService
        .connect()
        .from("category")
        .select("*", { count: "exact", head: true });
    return count;
  }
  async updateCategory(
    id: number,
    payload: UpdateCategoryDto
  ): Promise<ICategory> {
    let res = await this.superBaseService
      .connect()
      .from("category")
      .select("*")
      .eq("id", id)
      .single();
    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "Category not found",
      });

    res = await this.superBaseService
      .connect()
      .from("Country")
      .update({
        name: payload.name,
        icon: payload.icon,
        updated_at: new Date(),
        is_active: payload.is_active,
        updated_by: "",
      })
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    }
    return res.data;
  }
  async toggleActiveICategory(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<ICategory>> {
    let res = await this.superBaseService
      .connect()
      .from("category")
      .select("*")
      .eq("id", id)
      .single();
    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "category not found",
      });

    res = await this.superBaseService
      .connect()
      .from("category")
      .update({ active: payload.activate })
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }
  async deleteCategory(id: number): Promise<ICategory> {
    let res = await this.superBaseService
      .connect()
      .from("category")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "category not found",
      });

    let { data, error } = await this.superBaseService
      .connect()
      .from("category")
      .delete()
      .eq("id", id);
    if (res.error) {
      this.logger.error(error);
      throw new BadRequestException({
        message: error.message,
        status: EResponseStatus.ERROR,
      });
    }
    return data;
  }
}
