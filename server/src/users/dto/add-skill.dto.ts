import { IsInt } from 'class-validator';

export class AddSkillToUserDto {
    @IsInt()
    skillId: number;
}
