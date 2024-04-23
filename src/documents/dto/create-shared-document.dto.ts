import { IsInt } from 'class-validator';

export class CreateSharedDocumentDto {
  @IsInt()
  userId: number;

  @IsInt()
  documentId: number;
}
