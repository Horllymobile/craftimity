import { CrateCrafmanDto } from "src/resources/craftsmen/dto/create-craftman.dto";
import { ICraftsman } from "../ICraftsman";
import { UpdateCrafmanDto } from "src/resources/craftsmen/dto/update-craftman.dto";

export interface ICraftsmanService {
  createCraftsman(payload: CrateCrafmanDto): Promise<ICraftsman>;

  findCraftsmen(
    page: number,
    size: number,
    name?: string
  ): Promise<ICraftsman[]>;

  findCraftsmanById(id: string): Promise<ICraftsman>;

  findCraftsmanByEmail(email: string): Promise<ICraftsman>;

  findCraftsmanByPhone(phone: string): Promise<ICraftsman>;

  updateCraftsman(id: string, payload: UpdateCrafmanDto): Promise<any>;
  deleteCraftsman(id: string): Promise<any>;
  toggleCraftsmanStatus?(id: string): Promise<any>;
}
