import { UserService } from "src/resources/user/service/user.service";
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from "@nestjs/common";
import { ICraftsman } from "src/core/interfaces/ICraftsman";
import { ICraftsmanService } from "src/core/interfaces/services/ICraftsmanService";
import { CrateCrafmanDto } from "../dto/create-craftman.dto";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
import { UpdateCraft } from "src/resources/auth/dto/dto";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { ERole } from "src/core/enums/Role";
import { EApprovalStatus } from "src/core/enums/approval-status";

@Injectable({ scope: Scope.REQUEST })
export class CraftsmenService implements ICraftsmanService {
  private readonly logger = new Logger(CraftsmenService.name);
  constructor(
    private readonly superBaseService: SuperbaseService,
    private readonly userService: UserService
  ) {}

  async createCraftsman(
    payload: CrateCrafmanDto,
    currentUser: any
  ): Promise<void> {
    if (currentUser.sub !== payload.user_id) {
      throw new UnauthorizedException({
        message: "You are not authorized to update",
        status: EResponseStatus.FAILED,
      });
    }

    const user = await this.userService.findUserById(payload.user_id);
    if (!user) {
      throw new NotFoundException({
        status: EResponseStatus.FAILED,
        message: "User not found",
      });
    }

    let craftman = await this.findCraftsmanById(payload.user_id);

    if (!craftman) {
      const res = await this.superBaseService
        .connect()
        .from("artisan")
        .insert({
          id: payload.user_id,
          name: payload.name,
          business_name: payload.business_name ?? null,
          category: payload.category,
          certificate: payload.certificate,
          work_id: payload.work_id,
        });

      if (res.error) {
        this.logger.error(res.error);
      }
    }

    if (craftman && craftman.approved === EApprovalStatus.APPROVED) {
      throw new ConflictException({
        status: EResponseStatus.FAILED,
        message: "Artisan as been approved",
      });
    } else {
      const res = await this.superBaseService
        .connect()
        .from("artisan")
        .update({
          name: payload.name || craftman.name,
          business_name: payload.business_name || craftman.business_name,
          category: payload.category || craftman.category,
          certificate: payload.certificate || craftman.certificate,
          work_id: payload.work_id || craftman.work_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.user_id);

      if (res.error) {
        this.logger.log(res.error);
      }
    }
  }

  findCraftsmen(
    page: number,
    size: number,
    name?: string
  ): Promise<ICraftsman[]> {
    throw new Error("Method not implemented.");
  }
  async findCraftsmanById(id: string): Promise<ICraftsman> {
    let { data, error } = await this.superBaseService
      .connect()
      .from("artisan")
      .select(
        `id, name, business_name, 
        category(*), work_id, certificate, approved, work_id_approved, 
        certificate_approved, created_at, updated_at, user(*)`
      )
      .eq("id", id)
      .single();

    if (error) this.logger.error(error);

    return data;
  }

  async updateCraftsman(id: string, payload: UpdateCraft) {
    let user = await this.superBaseService
      .connect()
      .from("user")
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
