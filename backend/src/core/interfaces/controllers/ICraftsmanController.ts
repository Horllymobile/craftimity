import { CrateCrafmanDto } from "src/resources/craftsmen/dto/create-craftman.dto";
import { ICraftsman } from "../ICraftsman";
import { UpdateCraft } from "src/resources/craftsmen/dto/update-craftman.dto";
import { IResponse } from "../IResponse";
import { IPagination } from "../IPagination";

export interface ICraftsmanController {
  createCraftsman(payload: CrateCrafmanDto): Promise<IResponse<ICraftsman>>;

  findCraftsmen(
    page: number,
    size: number,
    name?: string
  ): Promise<IResponse<IPagination<ICraftsman>>>;

  findCraftsmanById(id: string): Promise<IResponse<ICraftsman>>;

  findCraftsmanByEmail(email: string): Promise<IResponse<ICraftsman>>;

  findCraftsmanByPhone(phone: string): Promise<IResponse<ICraftsman>>;

  updateCraftsman(id: string, payload: UpdateCraft): Promise<any>;
  deleteCraftsman(id: string): Promise<any>;
  toggleCraftsmanStatus?(id: string): Promise<any>;
}
