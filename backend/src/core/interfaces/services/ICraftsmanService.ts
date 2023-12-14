import { CrateCrafmanDto } from "src/resources/craftsmen/dto/create-craftman.dto";
import { ICraftsman } from "../ICraftsman";
import { UpdateCraft } from "src/resources/craftsmen/dto/update-craftman.dto";

export interface ICraftsmanService {
  createCraftsman(payload: CrateCrafmanDto, user: any): Promise<void>;

  findCraftsmen(
    page: number,
    size: number,
    name?: string
  ): Promise<ICraftsman[]>;

  findCraftsmanById(id: string): Promise<ICraftsman>;

  updateCraftsman(id: string, payload: UpdateCraft): Promise<any>;
  deleteCraftsman(id: string): Promise<any>;
  toggleCraftsmanStatus?(id: string): Promise<any>;
}
