import { Test, TestingModule } from "@nestjs/testing";
import { CraftsmenService } from "./craftsmen.service";

describe("CraftsmenService", () => {
  let service: CraftsmenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CraftsmenService],
    }).compile();

    service = module.get<CraftsmenService>(CraftsmenService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
