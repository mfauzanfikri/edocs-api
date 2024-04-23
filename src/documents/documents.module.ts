import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaService } from 'src/prisma.service';
import { SharedDocumentsService } from './shared-documents.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, SharedDocumentsService, PrismaService],
})
export class DocumentsModule {}
