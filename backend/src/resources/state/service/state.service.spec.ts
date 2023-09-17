import { Test, TestingModule } from "@nestjs/testing";
import { StateService } from "./state.service";
import { IState } from "src/core/interfaces/IState";
import { UpdateStateDto } from "../dto/update-state.dto";
import { CreateStateDto } from "../dto/create-state.dto";

describe("StateService", () => {
  let service: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateService],
    }).compile();

    service = module.get<StateService>(StateService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return states", async () => {
    const result: IState[] = [
      {
        id: 1,
        name: "Nigeria",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: true,
      },
    ];
    jest.spyOn(service, "findStates").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await service.findStates(1, 20)).toBe(result);
  });

  it("should return a state by id", async () => {
    const result: IState = {
      id: 1,
      name: "Nigeria",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active: true,
    };
    jest.spyOn(service, "findStateById").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await service.findStateById(1)).toBe(result);
  });

  it("should update a state by id", async () => {
    const id = 1;
    const payload: UpdateStateDto = {
      name: "Nigeria",
    };
    const result: IState = {
      id: 1,
      name: "Nigeria",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active: true,
    };
    jest.spyOn(service, "updateState").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await service.updateState(id, payload)).toBe(result);
  });

  it("should create a state", async () => {
    const payload: CreateStateDto = {
      name: "Nigeria",
      country_id: 1,
    };
    const result: IState = {
      id: 1,
      name: "Nigeria",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active: true,
    };
    const states = [];
    jest.spyOn(service, "createState").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(states.length).toBe(0);
    expect(await service.createState(payload)).toBe(result);
    states.push({
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
    expect(states.length).toBe(1);
  });

  it("should return total numbers of states", async () => {
    const id = 1;
    const result: number = 0;
    jest.spyOn(service, "countStates").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(await service.countStates()).toBe(result);
  });

  it("should delete a state by id", async () => {
    const id = 1;
    const result: IState = {
      id: 1,
      name: "Nigeria",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active: true,
    };
    const states: IState[] = [
      {
        id: 1,
        name: "Lagos",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: true,
      },
    ];
    jest.spyOn(service, "deleteState").mockImplementation(
      () =>
        new Promise((res, rej) => {
          return res(result);
        })
    );
    expect(states.length).toBe(1);
    expect(await service.deleteState(id)).toBe(result);
    states.pop();
    expect(states.length).toBe(0);
  });
});
