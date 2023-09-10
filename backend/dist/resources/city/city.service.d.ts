import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
export declare class CityService {
    create(createCityDto: CreateCityDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCityDto: UpdateCityDto): string;
    remove(id: number): string;
}
