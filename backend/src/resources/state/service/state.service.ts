import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateStateDto } from "../dto/create-state.dto";
import { UpdateStateDto } from "../dto/update-state.dto";
import { IStateService } from "src/core/interfaces/services/IStateService";
import { IState } from "src/core/interfaces/IState";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { IResponse } from "src/core/interfaces/IResponse";

@Injectable()
export class StateService implements IStateService {
  private readonly logger = new Logger(StateService.name);

  constructor(private readonly superBaseService: SuperbaseService) {}

  async createState(payload: CreateStateDto): Promise<IState> {
    let res = await this.superBaseService
      .connect()
      .from("state")
      .select("*")
      .eq("name", payload.name)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "State already exist",
      });

    res = await this.superBaseService.connect().from("state").insert({
      name: payload.name,
      country_id: payload.country_id,
    });

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }
  async findStates(
    page: number,
    size: number,
    name?: string,
    country_id?: number,
    status?: boolean
  ): Promise<IState[]> {
    page = page <= 1 ? 0 : page;
    let res: { data: IState[]; error: any };
    if (name && country_id) {
      res = await this.superBaseService
        .connect()
        .from("state")
        .select(
          "id, name, active, country_id, created_at, updated_at, country(id, name, code)"
        )
        .ilike("name", `%${name}%`)
        .limit(size)
        .eq("country_id", country_id)
        .eq("active", status ?? true)
        .order("id", { ascending: true })
        .range(page, size);
    } else if (name) {
      res = await this.superBaseService
        .connect()
        .from("state")
        .select(
          "id, name, active, country_id, created_at, updated_at, country(id, name, code)"
        )
        .ilike("name", `%${name}%`)
        .limit(size)
        .eq("country_id", country_id)
        .order("id", { ascending: true })
        .eq("active", status ?? true)
        .range(page, size);
    } else if (country_id) {
      res = await this.superBaseService
        .connect()
        .from("state")
        .select(
          "id, name, active, country_id, created_at, updated_at, country(id, name, code)"
        )
        .eq("country_id", country_id)
        .limit(size)
        .order("id", { ascending: true })
        .eq("active", status ?? true)
        .range(page, size);
    } else {
      res = await this.superBaseService
        .connect()
        .from("state")
        .select(
          "id, name, active, country_id, created_at, updated_at, country(id, name, code)"
        )
        .limit(size)
        .order("id", { ascending: true })
        .eq("active", status ?? true)
        .range(page, size);
    }

    if (res.error) {
      this.logger.error(res.error);
    }
    return res.data ?? [];
  }
  async findStateById(id: number): Promise<IState> {
    let res = await this.superBaseService
      .connect()
      .from("state")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "State not found",
      });
    return res.data;
  }
  async countStates(): Promise<number> {
    let { data, count }: { data: IState[]; count: number } =
      await this.superBaseService
        .connect()
        .from("state")
        .select("*", { count: "exact", head: true });
    return count;
  }
  async updateState(id: number, payload: UpdateStateDto): Promise<IState> {
    let res = await this.superBaseService
      .connect()
      .from("state")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "State not found",
      });

    res = await this.superBaseService
      .connect()
      .from("state")
      .update({
        name: payload.name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    }
    return res.data;
  }
  async toggleActiveIState(
    id: number,
    payload: { activate: boolean }
  ): Promise<IResponse<IState>> {
    let res = await this.superBaseService
      .connect()
      .from("state")
      .select("*")
      .eq("id", id)
      .single();
    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "State not found",
      });

    res = await this.superBaseService
      .connect()
      .from("state")
      .update({
        active: payload.activate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }
  async deleteState(id: number): Promise<IState> {
    let res = await this.superBaseService
      .connect()
      .from("state")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "State not found",
      });

    let { data, error } = await this.superBaseService
      .connect()
      .from("state")
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
