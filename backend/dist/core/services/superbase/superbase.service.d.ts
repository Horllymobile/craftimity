import { ConfigService } from "@nestjs/config";
export declare class SuperbaseService {
    private configService;
    constructor(configService: ConfigService);
    connect(): import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
}
