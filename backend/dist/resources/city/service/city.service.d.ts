import { CreateCityDto } from "../dto/create-city.dto";
import { UpdateCityDto } from "../dto/update-city.dto";
import { ICityService } from "src/core/interfaces/services/ICityService";
import { ICity } from "src/core/interfaces/ICity";
import { IResponse } from "src/core/interfaces/IResponse";
import { SuperbaseService } from "src/core/services/superbase/superbase.service";
export declare class CityService implements ICityService {
    private readonly superBaseService;
    private readonly logger;
    constructor(superBaseService: SuperbaseService);
    createCity(createCityDto: CreateCityDto): Promise<ICity>;
    findCities(page: number, size: number, name?: string): Promise<ICity[]>;
    findCityById(id: number): Promise<ICity>;
    countCities(): Promise<number>;
    updateCity(id: number, updateCityDto: UpdateCityDto): Promise<ICity>;
    toggleActiveICity(id: number, payload: {
        activate: boolean;
    }): Promise<IResponse<ICity>>;
    deleteCity(id: number): Promise<ICity>;
}
