import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
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

  async createCity(payload: CreateCityDto): Promise<ICity> {
    let res = await this.superBaseService
      .connect()
      .from("City")
      .select("id, name, created_at, updated_at, state_id, active")
      .eq("name", payload.name)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "City already exist",
      });

    res = await this.superBaseService.connect().from("City").insert({
      name: payload.name,
      state_id: payload.state_id,
    });

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }

  async findCities(
    page: number,
    size: number,
    name?: string,
    state_id?: number,
    status?: boolean
  ): Promise<ICity[]> {
    page = page <= 1 ? 0 : page;
    let res: { data: ICity[]; error: any };
    if (name && state_id) {
      res = await this.superBaseService
        .connect()
        .from("City")
        .select(
          "id, name, active, created_at, updated_at, State(id, name, active)"
        )
        .ilike("name", `%${name}%`)
        .limit(size)
        .eq("state_id", state_id)
        .eq("active", status ?? true)
        .order("id", { ascending: true })
        .range(page, size);
    } else if (name) {
      res = await this.superBaseService
        .connect()
        .from("City")
        .select(
          "id, name, active, created_at, updated_at, State(id, name, active)"
        )
        .ilike("name", `%${name}%`)
        .limit(size)
        .eq("state_id", state_id)
        .eq("active", status ?? true)
        .order("id", { ascending: true })
        .range(page, size);
    } else if (state_id) {
      res = await this.superBaseService
        .connect()
        .from("City")
        .select(
          "id, name, active, created_at, updated_at, State(id, name, active)"
        )
        .eq("state_id", state_id)
        .eq("active", status ?? true)
        .limit(size)
        .order("id", { ascending: true })
        .range(page, size);
    } else {
      res = await this.superBaseService
        .connect()
        .from("City")
        .select(
          "id, name, active, created_at, updated_at, State(id, name, active)"
        )
        .limit(size)
        .eq("active", status ?? true)
        .order("id", { ascending: true })
        .range(page, size);
    }

    if (res.error) {
      this.logger.error(res.error);
    }
    return res.data ?? [];
  }
  async findCityById(id: number): Promise<ICity> {
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
    return res.data;
  }
  async countCities(): Promise<number> {
    let { data, count }: { data: ICity[]; count: number } =
      await this.superBaseService
        .connect()
        .from("City")
        .select("*", { count: "exact", head: true });
    return count;
  }
  async updateCity(id: number, payload: UpdateCityDto): Promise<ICity> {
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
      .update({
        name: payload.name,
        updated_at: new Date(),
      })
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    }
    return res.data;
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

  async deleteCity(id: number): Promise<ICity> {
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

    let { data, error } = await this.superBaseService
      .connect()
      .from("City")
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
