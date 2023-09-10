import { Test, TestingModule } from "@nestjs/testing";
import { CountryService } from "./country.service";
import { ICountry } from "src/core/interfaces/ICountry";
import { UpdateCountryDto } from "../dto/update-country.dto";
import { CreateCountryDto } from "../dto/create-country.dto";

describe("CountryService", () => {
  let service: CountryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        CountryService,
        {
          provide: "CountryEntityRepository",
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return countries", async () => {
    const result: ICountry[] = [
      {
        id: 1,
        name: "Nigeria",
        code: "NG",
        currency: "Naira",
        currencyCode: "NGN",
        phoneCode: "234",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        active: true,
      },
    ];
    jest.spyOn(service, "findCountries").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await service.findCountries(1, 20)).toBe(result);
  });

  it("should return a country by id", async () => {
    const result: ICountry = {
      id: 1,
      name: "Nigeria",
      code: "NG",
      currency: "Naira",
      currencyCode: "NGN",
      phoneCode: "234",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
    };
    jest.spyOn(service, "findCountryById").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await service.findCountryById(1)).toBe(result);
  });

  it("should update a country by id", async () => {
    const id = 1;
    const payload: UpdateCountryDto = {
      name: "Nigeria",
      code: "NG",
      currency: "Naira",
      currencyCode: "NGN",
      phoneCode: "234",
    };
    const result: ICountry = {
      id: 1,
      name: "Nigeria",
      code: "NG",
      currency: "Naira",
      currencyCode: "NGN",
      phoneCode: "234",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
    };
    jest.spyOn(service, "updateCountry").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await service.updateCountry(id, payload)).toBe(result);
  });

  it("should create a country", async () => {
    const payload: CreateCountryDto = {
      name: "Nigeria",
      code: "NG",
      currency: "Naira",
      currencyCode: "NGN",
      phoneCode: "234",
    };
    const result: ICountry = {
      id: 1,
      name: "Nigeria",
      code: "NG",
      currency: "Naira",
      currencyCode: "NGN",
      phoneCode: "234",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
    };
    const countries = [];
    jest.spyOn(service, "createCountry").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(countries.length).toBe(0);
    expect(await service.createCountry(payload)).toBe(result);
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

  it("should return total numbers of countries", async () => {
    const id = 1;
    const result: number = 0;
    jest.spyOn(service, "countCountries").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await service.countCountries()).toBe(result);
  });

  it("should delete a country by id", async () => {
    const id = 1;
    const result: ICountry = {
      id: 1,
      name: "Nigeria",
      code: "NG",
      currency: "Naira",
      currencyCode: "NGN",
      phoneCode: "234",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: true,
    };
    const countries: ICountry[] = [
      {
        id: 1,
        name: "Nigeria",
        code: "NG",
        currency: "Naira",
        currencyCode: "NGN",
        phoneCode: "234",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        active: true,
      },
    ];
    jest.spyOn(service, "deleteCountry").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(countries.length).toBe(1);
    expect(await service.deleteCountry(id)).toBe(result);
    countries.pop();
    expect(countries.length).toBe(0);
  });
});
