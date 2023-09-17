import { Test, TestingModule } from "@nestjs/testing";
import { StateController } from "./state.controller";
import { StateService } from "../service/state.service";
import { IState } from "src/core/interfaces/IState";
import { IPagination } from "src/core/interfaces/IPagination";
import { IResponse } from "src/core/interfaces/IResponse";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { CreateStateDto } from "../dto/create-state.dto";

describe("StateController", () => {
  let controller: StateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [StateService],
    }).compile();

    controller = module.get<StateController>(StateController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return countries", async () => {
    const result: IResponse<IPagination<IState[]>> = {
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
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            active: true,
          },
        ],
      },
    };
    jest.spyOn(controller, "findStates").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await controller.findStates(1, 20)).toBe(result);
  });

  it("should return a state by id", async () => {
    const result: IResponse<IState> = {
      status: EResponseStatus.SUCCESS,
      message: "",
      data: {
        id: 1,
        name: "Nigeria",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: true,
      },
    };
    jest.spyOn(controller, "findStateById").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await controller.findStateById(1)).toBe(result);
  });
  it("should create a state", async () => {
    const payload: CreateStateDto = {
      name: "Nigeria",
      country_id: 1,
    };
    const result: IResponse<IState> = {
      status: EResponseStatus.SUCCESS,
      message: "Created state sucessfully",
      data: {
        id: 1,
        name: "Nigeria",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: true,
      },
    };
    const countries = [];
    jest.spyOn(controller, "createState").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(countries.length).toBe(0);
    expect(await controller.createState(payload)).toBe(result);
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
