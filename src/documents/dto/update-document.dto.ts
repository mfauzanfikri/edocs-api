import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsBoolean()
  @IsOptional()
  isShareable?: boolean;
}
