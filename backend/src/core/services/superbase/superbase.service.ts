import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class SuperbaseService {
  constructor(private configService: ConfigService) {}

  connect() {
    const supabase = createClient(
      "https://lxscyztmkcklnybwpymh.supabase.co",
      this.configService.get("SUPERBASE_API"),
      {
        auth: {
          persistSession: false,
        },
      }
    );
    return supabase;
  }
}
