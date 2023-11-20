import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { CraftsmenService } from "../service/craftsmen.service";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { AuthGuard } from "src/core/guards/auth.guard";
import { IResponse } from "src/core/interfaces/IResponse";
import { UpdateCraft } from "../dto/update-craftman.dto";
import { Request } from "express";
import { IUser } from "src/core/interfaces/IUser";
import { ERole } from "src/core/enums/Role";

@UseGuards(AuthGuard)
@Controller("craftsmen")
export class CraftsmenController {
  constructor(private readonly craftsmenService: CraftsmenService) {}

  @Put("update-craftman/:id")
  async updateCraftman(
    @Param("id") id: string,
    @Body() payload: UpdateCraft,
    request: Request
  ): Promise<IResponse<any>> {
    const user = request["user"];
    console.log(user);
    if (
      request["user"].id !== id &&
      (user.role !== ERole.SUPER_ADMIN || user.role !== ERole.ADMIN)
    ) {
      throw new UnauthorizedException({
        message: "You are not authorized to update",
        status: EResponseStatus.FAILED,
      });
    }
    const req = await this.craftsmenService.updateCraftsman(id, payload);
    return {
      message: "Update user successfull",
      data: req,
      status: EResponseStatus.SUCCESS,
    };
  }
}
