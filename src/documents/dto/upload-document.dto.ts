import { IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  id: string;
}
