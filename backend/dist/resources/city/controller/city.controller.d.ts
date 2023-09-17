import { CityService } from "../service/city.service";
import { CreateCityDto } from "../dto/create-city.dto";
import { UpdateCityDto } from "../dto/update-city.dto";
export declare class CityController {
    private readonly cityService;
    constructor(cityService: CityService);
    create(createCityDto: CreateCityDto): Promise<import("../../../core/interfaces/ICity").ICity>;
    findAll(page?: number, size?: number, name?: string, state_id?: number): Promise<import("../../../core/interfaces/ICity").ICity[]>;
    findOne(id: number): Promise<import("../../../core/interfaces/ICity").ICity>;
    update(id: string, updateCityDto: UpdateCityDto): Promise<import("../../../core/interfaces/ICity").ICity>;
    remove(id: string): Promise<import("../../../core/interfaces/ICity").ICity>;
}
