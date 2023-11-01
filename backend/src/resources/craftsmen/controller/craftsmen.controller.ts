import { Controller } from "@nestjs/common";
import { CraftsmenService } from "../service/craftsmen.service";

@Controller("craftsmen")
export class CraftsmenController {
  constructor(private readonly craftsmenService: CraftsmenService) {}
}
