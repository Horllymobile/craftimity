import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ICraftsman } from "src/core/interfaces/ICraftsman";
import { ICraftsmanService } from "src/core/interfaces/services/ICraftsmanService";
import { CrateCrafmanDto } from "../dto/create-craftman.dto";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { UpdateCraft } from "src/resources/auth/dto/dto";
import { EResponseStatus } from "src/core/enums/ResponseStatus";

@Injectable()
export class CraftsmenService implements ICraftsmanService {
  private readonly logger = new Logger(CraftsmenService.name);
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
  async updateCraftsman(id: string, payload: UpdateCraft) {
    let user = await this.superBaseService
      .connect()
      .from("User")
      .select("*")
      .eq("id", id)
      .single();

    if (!user.data)
      throw new NotFoundException({
        message: "User not found",
        status: EResponseStatus.FAILED,
      });

    let res = await this.updateCraft(id, payload);

    if (!res.error) this.logger.error(res.error);

    // const mail = await this.elasticService.sendEmailDynamic({
    //   Recipients: {
    //     To: [user.data.email],
    //   },
    //   Content: {
    //     From: "info@craftimity.com",
    //     TemplateName: "WELCOMING_EMAIL",
    //     Subject: "Welcome to Craftimity - Let's Get Crafty Together!",
    //     Merge: {
    //       full_name: `${user.data.first_name} ${user.data.last_name}`,
    //       accountaddress: "info@craftimity.com",
    //     },
    //   },
    // });
    // if (mail.data) {
    //   this.logger.log(mail.data);
    // }
  }

  async updateCraft(id: string, payload: UpdateCraft) {
    return await this.superBaseService.connect().from("crafts").insert({
      name: payload.service_name,
      business_name: payload.business_name,
      category: payload.service_category,
      is_active: true,
      user_id: id,
    });
  }
  deleteCraftsman(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  toggleCraftsmanStatus?(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
