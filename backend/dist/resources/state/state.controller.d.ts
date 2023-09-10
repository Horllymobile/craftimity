import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
export declare class StateController {
    private readonly stateService;
    constructor(stateService: StateService);
    create(createStateDto: CreateStateDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStateDto: UpdateStateDto): string;
    remove(id: string): string;
}
