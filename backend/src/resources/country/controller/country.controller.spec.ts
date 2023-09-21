import { Test, TestingModule } from "@nestjs/testing";
import { CountryController } from "./country.controller";
import { CountryService } from "../service/country.service";
import { IResponse } from "src/core/interfaces/IResponse";
import { ICountry } from "src/core/interfaces/ICountry";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { IPagination } from "src/core/interfaces/IPagination";
import { CreateCountryDto } from "../dto/create-country.dto";

describe("CountryController", () => {
  let controller: CountryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [CountryController],
      providers: [
        CountryService,
        {
          provide: "CountryEntityRepository",
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CountryController>(CountryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return countries", async () => {
    const result: IResponse<IPagination<ICountry[]>> = {
      status: EResponseStatus.SUCCESS,
      message: "Countries retrieved successfully",
      data: {
        page: 1,
        size: 10,
        total: 80,
        data: [
          {
            id: 1,
            name: "Nigeria",
            code: "NG",
            currency: "Naira",
            currency_code: "NGN",
            phone_code: "234",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            active: true,
          },
        ],
      },
    };
    jest.spyOn(controller, "findCountries").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await controller.findCountries(1, 20)).toBe(result);
  });

  it("should return a country by id", async () => {
    const result: IResponse<ICountry> = {
      status: EResponseStatus.SUCCESS,
      message: "",
      data: {
        id: 1,
        name: "Nigeria",
        code: "NG",
        currency: "Naira",
        currency_code: "NGN",
        phone_code: "234",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: true,
      },
    };
    jest.spyOn(controller, "findCountryById").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await controller.findCountryById(1)).toBe(result);
  });

  it("should create a country", async () => {
    const payload: CreateCountryDto = {
      name: "Nigeria",
      code: "NG",
      currency: "Naira",
      currencyCode: "NGN",
      phoneCode: "234",
      currencySymbol: "N",
    };
    const result: IResponse<ICountry> = {
      status: EResponseStatus.SUCCESS,
      message: "Created country sucessfully",
      data: {
        id: 1,
        name: "Nigeria",
        code: "NG",
        currency: "Naira",
        currency_code: "NGN",
        phone_code: "234",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: true,
      },
    };
    const countries = [];
    jest.spyOn(controller, "createCountry").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(countries.length).toBe(0);
    expect(await controller.createCountry(payload)).toBe(result);
    countries.push({
      id: 1,
      name: "Nigeria",
      code: "NG",
      currency: "Naira",
      currencyCode: "NGN",
      phoneCode: "234",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
    });
    expect(countries.length).toBe(1);
  });
});
