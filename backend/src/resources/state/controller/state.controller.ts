import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from "@nestjs/common";
import { StateService } from "../service/state.service";
import { CreateStateDto } from "../dto/create-state.dto";
import { UpdateStateDto } from "../dto/update-state.dto";
import { IStateController } from "src/core/interfaces/controllers/IStateController";
import { IPagination } from "src/core/interfaces/IPagination";
import { IResponse } from "src/core/interfaces/IResponse";
import { IState } from "src/core/interfaces/IState";
import { EResponseStatus } from "src/core/enums/ResponseStatus";
import { ToogleActiveDto } from "src/core/dto/dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("State")
@Controller("api/v1/states")
export class StateController implements IStateController {
  constructor(private readonly stateService: StateService) {}

  @Post("")
  async createState(
    @Body() payload: CreateStateDto
  ): Promise<IResponse<IState>> {
    const states = await this.stateService.createState(payload);
    return {
      status: EResponseStatus.SUCCESS,
      message: "Created country sucessfully",
      data: states,
    };
  }

  @Get("")
  async findStates(
    @Query("page") page: number = 1,
    @Query("size") size: number = 10,
    @Query("name") name?: string,
    @Query("country") country_id?: number
  ): Promise<IResponse<IPagination<IState[]>>> {
    const states = await this.stateService.findStates(
      page,
      size,
      name,
      country_id
    );
    const total = await this.stateService.countStates();
    return {
      message: "States fetched successfully",
      status: EResponseStatus.SUCCESS,
      data: {
        page,
        size,
        total,
        data: states,
      },
    };
  }

  @Get(":id")
  async findStateById(@Param("id") id: number): Promise<IResponse<IState>> {
    const state = await this.stateService.findStateById(id);
    return {
      message: "State retrieve successfully",
      status: EResponseStatus.SUCCESS,
      data: state,
    };
  }

  @Put(":id")
  async updateState(
    @Param("id") id: number,
    @Body() payload: UpdateStateDto
  ): Promise<IResponse<IState>> {
    await this.stateService.updateState(id, payload);
    return {
      message: "State updated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch(":id/activate")
  async activateIState(
    @Param("id") id: number,
    @Body() payload: ToogleActiveDto
  ): Promise<IResponse<IState>> {
    await this.stateService.toggleActiveIState(id, payload);
    return {
      message: "State activated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Patch(":id/deactivate")
  async deactivateIState(
    @Param("id") id: number,
    @Body() payload: ToogleActiveDto
  ): Promise<IResponse<IState>> {
    await this.stateService.toggleActiveIState(id, payload);
    return {
      message: "State deactivated successfully",
      status: EResponseStatus.SUCCESS,
    };
  }

  @Delete(":id")
  async deleteState(@Param("id") id: number): Promise<IResponse<IState>> {
    await this.stateService.deleteState(id);
    return {
      message: "State deleted successfully",
      status: EResponseStatus.SUCCESS,
    };
  }
}
