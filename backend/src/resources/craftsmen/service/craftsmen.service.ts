import { Injectable } from "@nestjs/common";
import { ICraftsman } from "src/core/interfaces/ICraftsman";
import { ICraftsmanService } from "src/core/interfaces/services/ICraftsmanService";
import { CrateCrafmanDto } from "../dto/create-craftman.dto";
import { UpdateCrafmanDto } from "../dto/update-craftman.dto";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";

@Injectable()
export class CraftsmenService implements ICraftsmanService {
  constructor(private readonly superBaseService: SuperbaseService) {}
  createCraftsman(payload: CrateCrafmanDto): Promise<ICraftsman> {
    throw new Error("Method not implemented.");
  }
  findCraftsmen(
    page: number,
    size: number,
    name?: string
  ): Promise<ICraftsman[]> {
    throw new Error("Method not implemented.");
  }
  findCraftsmanById(id: string): Promise<ICraftsman> {
    throw new Error("Method not implemented.");
  }
  findCraftsmanByEmail(email: string): Promise<ICraftsman> {
    throw new Error("Method not implemented.");
  }
  findCraftsmanByPhone(phone: string): Promise<ICraftsman> {
    throw new Error("Method not implemented.");
  }
  updateCraftsman(id: string, payload: UpdateCrafmanDto): Promise<any> {
    throw new Error("Method not implemented.");
  }
  deleteCraftsman(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  toggleCraftsmanStatus?(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
