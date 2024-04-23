import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSharedDocumentDto } from './dto/create-shared-document.dto';

@Injectable()
export class SharedDocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUserId(userId: number) {
    return this.prisma.sharedDocument.findMany({
      where: {
        userId,
      },
      include: {
        Document: true,
      },
    });
  }

  findAllByDocumentId(documentId: number) {
    return this.prisma.sharedDocument.findMany({
      where: { documentId },
      include: {
        User: true,
      },
    });
  }

  find(documentId: number, userId: number) {
    return this.prisma.sharedDocument.findFirst({
      where: { documentId, userId },
      include: {
        Document: true,
        User: true,
      },
    });
  }

  create(data: CreateSharedDocumentDto) {
    return this.prisma.sharedDocument.create({
      data,
    });
  }

  delete(documentId: number, userId: number) {
    return this.prisma.sharedDocument.delete({
      where: {
        documentId_userId: {
          documentId,
          userId,
        },
      },
    });
  }

  deleteByUserId(userId: number) {
    return this.prisma.sharedDocument.deleteMany({
      where: {
        userId,
      },
    });
  }

  deleteByDocumentId(documentId: number) {
    return this.prisma.sharedDocument.deleteMany({
      where: {
        documentId,
      },
    });
  }
}
