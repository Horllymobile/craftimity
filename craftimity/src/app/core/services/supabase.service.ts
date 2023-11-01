import { createClient } from "@supabase/supabase-js";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SupaBaseService {
  supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_API_KEY
  );

  async uploadFile(file: Blob): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from("Images/profiles/")
      .upload(`IMG-${Date.now()}`, file);
    if (error) {
      console.log(error);
    }
    return `https://lxscyztmkcklnybwpymh.supabase.co/storage/v1/object/public/Images/profiles/${data?.path}`;
  }
}
