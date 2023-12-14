import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SuperbaseService } from "./superbase/superbase.service";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private superbaseService: SuperbaseService) {}

  @Cron(CronExpression.EVERY_30_MINUTES, { name: "delete-code" })
  async deletedVerificationCode() {
    this.logger.log("verification_code delete job called");
    var twoHoursBefore = new Date();
    var d = new Date(twoHoursBefore.setHours(twoHoursBefore.getMinutes() - 30));
    const res = await this.superbaseService
      .connect()
      .from("verification_code")
      .delete()
      .filter("created_at", "gt", d.toISOString());
    if (res.error) {
      this.logger.log(res.error);
    }
    this.logger.log(res);
  }
}
