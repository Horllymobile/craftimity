import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateCountryDto } from "../dto/create-country.dto";
import { UpdateCountryDto } from "../dto/update-country.dto";
import { ICountry } from "src/core/interfaces/ICountry";
import { ICountryService } from "src/core/interfaces/services/ICountryService";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { EResponseStatus } from "src/core/enums/ResponseStatus";

@Injectable()
export class CountryService implements ICountryService {
  private readonly logger = new Logger(CountryService.name);
  constructor(private readonly superBaseService: SuperbaseService) {}

  async createCountry(payload: CreateCountryDto): Promise<ICountry> {
    let res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("name", payload.name)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "Country already exist",
      });

    res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("code", payload.code)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "Country already exist",
      });

    res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("currency", payload.currency)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "Country already exist",
      });

    res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("currency_code", payload.currencyCode)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "Country already exist",
      });

    res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("phone_code", payload.phoneCode)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "Country already exist",
      });

    res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("symbol", payload.currencySymbol)
      .single();

    if (res.data)
      throw new ConflictException({
        status: EResponseStatus.ERROR,
        message: "Country already exist",
      });

    res = await this.superBaseService.connect().from("Country").insert({
      name: payload.name,
      code: payload.code,
      phone_code: payload.phoneCode,
      currency: payload.currency,
      currency_code: payload.currencyCode,
      symbol: payload.currencySymbol,
    });

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }

  async findCountries(
    page: number = 1,
    size: number = 20,
    name?: string
  ): Promise<ICountry[]> {
    page = page <= 1 ? 0 : page;
    if (name) {
      let { data, error }: { data: ICountry[]; error: any } =
        await this.superBaseService
          .connect()
          .from("Country")
          .select(
            "id, name, code, currency, currency_code, phone_code, active, created_at, updated_at, symbol"
          )
          .ilike("name", `%${name}%`)
          .limit(size)
          .order("id", { ascending: true })
          .range(page, size);

      if (error) {
        console.log(error);
      }
      return data;
    }
    let { data, error }: { data: ICountry[]; error: any } =
      await this.superBaseService
        .connect()
        .from("Country")
        .select(
          "id, name, code, currency, currency_code, phone_code, active, created_at, updated_at, symbol"
        )
        .limit(size)
        .order("id", { ascending: true })
        .range(page, size);

    if (error) {
      console.log(error);
    }
    return data;
  }

  async countCountries(): Promise<number> {
    let { data, count }: { data: ICountry[]; count: number } =
      await this.superBaseService
        .connect()
        .from("Country")
        .select("*", { count: "exact", head: true });
    return count;
  }

  async findCountryById(id: number): Promise<ICountry> {
    let res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "Country not found",
      });
    return res.data;
  }

  async updateCountry(
    id: number,
    payload: UpdateCountryDto
  ): Promise<ICountry> {
    let res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("id", id)
      .single();
    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "Country not found",
      });

    res = await this.superBaseService
      .connect()
      .from("Country")
      .update({
        name: payload.name,
        code: payload.code,
        phone_code: payload.phoneCode,
        currency: payload.currency,
        currency_code: payload.currencyCode,
        symbol: payload.currencySymbol,
      })
      .eq("id", id);

    if (res.error) {
      this.logger.error(res.error);
    }

    return res.data;
  }

  async deleteCountry(id: number): Promise<ICountry> {
    let res = await this.superBaseService
      .connect()
      .from("Country")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.data)
      throw new NotFoundException({
        status: EResponseStatus.ERROR,
        message: "Country not found",
      });

    let { data, error } = await this.superBaseService
      .connect()
      .from("Country")
      .delete()
      .eq("id", id);
    if (res.error) {
      console.log(res.error);
      throw new BadRequestException({
        message: error.message,
        status: EResponseStatus.ERROR,
      });
    }
    return data;
  }
}
