import { ConflictException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCountryDto } from "../dto/create-country.dto";
import { UpdateCountryDto } from "../dto/update-country.dto";
import { ICountry } from "src/core/interfaces/ICountry";
import { InjectModel } from "@nestjs/sequelize";
import { CountryEntity } from "../entities/country.entity";
import { ICountryService } from "src/core/interfaces/services/ICountryService";
import { Op } from "sequelize";

@Injectable()
export class CountryService implements ICountryService {
  constructor(
    @InjectModel(CountryEntity)
    private countryRepository: typeof CountryEntity
  ) {}

  async createCountry(payload: CreateCountryDto): Promise<ICountry> {
    let country = await this.countryRepository.findOne({
      where: { name: payload.name },
    });

    if (country)
      throw new ConflictException({
        message: "Country already exist",
        statusCode: HttpStatus.CONFLICT,
      });

    country = await this.countryRepository.findOne({
      where: { code: payload.code },
    });

    if (country)
      throw new ConflictException({
        message: "Country already exist",
        statusCode: HttpStatus.CONFLICT,
      });

    country = await this.countryRepository.findOne({
      where: { currency: payload.currency },
    });

    if (country)
      throw new ConflictException({
        message: "Country already exist",
        statusCode: HttpStatus.CONFLICT,
      });

    country = await this.countryRepository.findOne({
      where: { currencyCode: payload.currencyCode },
    });

    if (country)
      throw new ConflictException({
        message: "Country already exist",
        statusCode: HttpStatus.CONFLICT,
      });

    country = await this.countryRepository.findOne({
      where: { phoneCode: payload.phoneCode },
    });

    if (country)
      throw new ConflictException({
        message: "Country already exist",
        statusCode: HttpStatus.CONFLICT,
      });
    let newCountry: any;
    if (
      payload.name === "Nigeria" ||
      payload.name === "United State of America"
    ) {
      newCountry = await this.countryRepository.create({
        name: payload.name,
        code: payload.code,
        currency: payload.currency,
        currencyCode: payload.currencyCode,
        phoneCode: payload.phoneCode,
        active: true,
      });
    } else {
      newCountry = await this.countryRepository.create({
        name: payload.name,
        code: payload.code,
        currency: payload.currency,
        currencyCode: payload.currencyCode,
        phoneCode: payload.phoneCode,
      });
    }

    newCountry.save();
    return {
      name: newCountry.name,
      code: newCountry.code,
      currency: newCountry.currency,
      currencyCode: newCountry.currencyCode,
      phoneCode: newCountry.phoneCode,
      active: newCountry.active,
    };
  }

  async findCountries(
    page: number,
    size: number,
    name?: string
  ): Promise<ICountry[]> {
    let countries: CountryEntity[];
    if (!name) {
      countries = await this.countryRepository.findAll({
        limit: size,
        offset: page <= 0 ? 1 : page,
      });
    } else {
      countries = await this.countryRepository.findAll({
        limit: size,
        offset: page <= 0 ? 1 : page,
        where: {
          ...(name && {
            [Op.or]: [
              {
                name: {
                  [Op.like]: `%${name ? name : ""}%`,
                },
              },
            ],
          }),
        },
      });
    }

    return countries.map((country) => ({
      id: country.id,
      name: country.name,
      code: country.code,
      phoneCode: country.phoneCode,
      currency: country.currency,
      currencyCode: country.currencyCode,
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
      active: country.active,
    }));
  }

  countCountries(): Promise<number> {
    return this.countryRepository.count();
  }

  async findCountryById(id: number): Promise<ICountry> {
    const country = await this.countryRepository.findOne({ where: { id } });
    return {
      id: country.id,
      name: country.name,
      code: country.code,
      currency: country.currency,
      currencyCode: country.currencyCode,
      active: country.active,
      phoneCode: country.phoneCode,
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
    };
  }

  updateCountry(
    id: number,
    updateCountryDto: UpdateCountryDto
  ): Promise<ICountry> {
    return null;
  }

  deleteCountry(id: number): Promise<ICountry> {
    return null;
  }
}
