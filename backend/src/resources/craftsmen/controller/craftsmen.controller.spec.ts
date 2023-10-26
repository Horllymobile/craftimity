import { Test, TestingModule } from "@nestjs/testing";
import { CraftsmenController } from "./craftsmen.controller";
import { CraftsmenService } from "../service/craftsmen.service";

describe("CraftsmenController", () => {
  let controller: CraftsmenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CraftsmenController],
      providers: [CraftsmenService],
    }).compile();

    controller = module.get<CraftsmenController>(CraftsmenController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
