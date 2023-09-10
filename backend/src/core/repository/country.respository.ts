import { Injectable } from "@nestjs/common";
import { Model } from "sequelize";
import { CountryEntity } from "src/resources/country/entities/country.entity";

@Injectable()
export class CountryRepository extends Model<CountryEntity> {}
