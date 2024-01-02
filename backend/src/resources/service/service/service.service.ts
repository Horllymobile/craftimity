import { UserService } from "src/resources/user/service/user.service";
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { CreateServiceDto } from "../dto/create-service.dto";
import { UpdateServiceDto } from "../dto/update-service.dto";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ElasticService } from "src/core/services/elastic.service";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { serviceReturnString } from "src/core/shared/data";
import { EResponseStatus } from "src/core/enums/ResponseStatus";

const PLATFORM_PERCENTAGE = 0.2;

@Injectable({ scope: Scope.REQUEST })
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);
  constructor(
    private readonly superBaseService: SuperbaseService,
    private readonly elasticService: ElasticService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly userService: UserService
  ) {}

  async findAll(payload: {
    status: string;
    page?: number;
    size?: number;
    category: number;
    name?: string;
    country?: number;
  }) {
    payload.page = payload.page <= 1 ? 0 : payload.page;
    let res: any;

    if (payload.name && !payload.category) {
      res = await this.superBaseService
        .connect()
        .from("services")
        .select(serviceReturnString)
        .ilike("name", `%${payload.name}%`)
        .limit(payload.size)
        .order("id", { ascending: true })
        .eq("is_active", payload.status)
        .range(payload.page, payload.size);
      if (res.error) {
        this.logger.error(res.error);
      }
      return res.data;
    }

    if (payload.name && payload.category) {
      res = await this.superBaseService
        .connect()
        .from("services")
        .select(serviceReturnString)
        .ilike("name", `%${payload.name}%`)
        .limit(payload.size)
        .order("id", { ascending: true })
        .eq("is_active", payload.status)
        .eq("category", payload.category)
        .range(payload.page, payload.size);
      if (res.error) {
        this.logger.error(res.error);
      }
      return res.data;
    }

    if (!payload.name && payload.category) {
      console.log(payload);
      res = await this.superBaseService
        .connect()
        .from("services")
        .select(serviceReturnString)
        .limit(payload.size)
        .order("id", { ascending: true })
        // .eq("is_active", payload.status)
        .eq("category", payload.category)
        .range(payload.page, payload.size);
      console.log(res.data);
      if (res.error) {
        this.logger.error(res.error);
      }
      return res.data;
    }

    res = await this.superBaseService
      .connect()
      .from("services")
      .select(serviceReturnString)
      .limit(payload.size)
      .eq("is_active", payload.status)
      .range(payload.page, payload.size);

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }

  async findById(id: number) {
    let { data, error } = await this.superBaseService
      .connect()
      .from("services")
      .select(serviceReturnString)
      .eq("id", id)
      .single();

    if (!data) {
      throw new NotFoundException({
        status: EResponseStatus.FAILED,
        message: `Service with id ${id} not found`,
      });
    }
    if (error) {
      this.logger.error(error);
    }
    return data;
  }

  async findByName(name: string) {
    let { data, error } = await this.superBaseService
      .connect()
      .from("services")
      .select(serviceReturnString)
      .eq("name", name)
      .single();

    if (error) {
      this.logger.error(error);
    }
    return data;
  }

  async countServices(): Promise<number> {
    let { data, count }: { data: any[]; count: number } =
      await this.superBaseService
        .connect()
        .from("country")
        .select("*", { count: "exact", head: true });
    return count;
  }

  async create(payload: CreateServiceDto, currentUser: any) {
    const user = await this.userService.findUserById(currentUser.sub);
    let service: any;
    let res: any;

    service = await this.findByName(payload.name);

    if (service)
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "Service with name already exist",
      });

    res = await this.superBaseService
      .connect()
      .from("services")
      .insert({
        name: payload.name,
        price: payload.price,
        description: payload.description,
        negotiable: payload.negotiable,
        platform_percentage: Math.floor(payload.price * PLATFORM_PERCENTAGE),
        artisan: user.artisan.id,
        category: user.artisan.category.id,
      });

    if (res.error) {
      this.logger.log(res.error);
    }
  }

  async update(id: number, payload: UpdateServiceDto) {
    let service: any;
    let res: any;

    service = await this.findById(id);

    if (!service)
      throw new NotFoundException({
        status: EResponseStatus.FAILED,
        message: "Service not found",
      });

    res = await this.superBaseService
      .connect()
      .from("services")
      .update({
        name: payload.name ?? service.name,
        price: payload.price ?? service.price,
        description: payload.description ?? service.description,
        negotiable: payload.negotiable ?? service.negotiable,
        platform_percentage:
          Math.floor(payload.price * PLATFORM_PERCENTAGE) ??
          service.platform_percentage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    } else if (!res.data && res.error) {
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.FAILED,
      });
    }

    return res.data;
  }

  async remove(id: number) {
    let service: any;
    let res: any;

    service = await this.findById(id);

    res = await this.superBaseService
      .connect()
      .from("services")
      .delete()
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    } else if (!res.data && res.error) {
      throw new InternalServerErrorException({
        message: "Something went wrong not your fault",
        status: EResponseStatus.FAILED,
      });
    }
  }
}
