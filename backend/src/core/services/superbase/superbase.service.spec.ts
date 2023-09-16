import { Test, TestingModule } from "@nestjs/testing";
import { SuperbaseService } from "./superbase.service";
import { ConfigService } from "@nestjs/config";

describe("SuperbaseService", () => {
  let service: SuperbaseService;
  let configServiceMock: Partial<ConfigService>;
  beforeEach(async () => {
    configServiceMock = {
      get: () => {},
      getOrThrow: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperbaseService,
        // ConfigService,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<SuperbaseService>(SuperbaseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
