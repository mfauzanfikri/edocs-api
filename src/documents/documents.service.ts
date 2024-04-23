import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAllByUsername(username: string) {
    return this.prisma.document.findMany({
      where: {
        User: {
          username: username,
        },
      },
    });
  }

  findAllByUserId(userId: number) {
    return this.prisma.document.findMany({
      where: {
        User: {
          id: userId,
        },
      },
    });
  }

  findById(documnetId: number) {
    return this.prisma.document.findFirst({
      where: {
        id: documnetId,
      },
    });
  }

  findByUserId(userId: number) {
    return this.prisma.document.findFirst({
      where: {
        userId,
      },
    });
  }

  findSharedById(userId: number, documentId: number) {
    return this.prisma.document.findFirst({
      where: {
        SharedDocument: {
          every: {
            userId,
            documentId,
          },
        },
      },
    });
  }

  create(data: CreateDocumentDto) {
    return this.prisma.document.create({
      data,
    });
  }

  update(documentId: number, data: UpdateDocumentDto) {
    return this.prisma.document.update({
      where: {
        id: documentId,
      },
      data,
    });
  }

  delete(documentId: number) {
    return this.prisma.document.delete({
      where: {
        id: documentId,
      },
    });
  }
}
