import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsInt()
  userId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsBoolean()
  @IsOptional()
  isShareable?: boolean;
}
