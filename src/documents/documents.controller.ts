import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Req,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { SharedDocumentsService } from './shared-documents.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { JwtPayload } from 'src/types/jwt-payload.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadDocumentDto } from './dto/upload-document.dto';
import fs from 'fs';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateSharedDocumentDto } from './dto/create-shared-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly sharedDocumentsService: SharedDocumentsService,
  ) {}

  @Get('/users/:id')
  @UseGuards(JwtAuthGuard)
  findAllByUserId(@Req() req: Request, @Param('id') id: string) {
    const payload = req.user as JwtPayload;

    // if authenticated user tries to access another user's documents
    if (payload.sub !== id) {
      throw new ForbiddenException('unauthorized');
    }

    return { data: this.documentsService.findAllByUserId(+id) };
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Req() req: Request, @Param('id') id: string) {
    const payload = req.user as JwtPayload;

    const document = await this.documentsService.findById(+id);

    if (!document) throw new NotFoundException('document not found');

    // if authenticated user tries to access another user's documents
    if (+payload.sub !== document.userId) {
      throw new ForbiddenException('unauthorized');
    }

    return { data: document };
  }

  @Get('/share/users/:id')
  @UseGuards(JwtAuthGuard)
  findAllSharedByUserId(@Req() req: Request, @Param('id') id: string) {
    const payload = req.user as JwtPayload;

    // if authenticated user tries to access not shared documents
    if (payload.sub !== id) {
      throw new ForbiddenException('unauthorized');
    }

    return { data: this.sharedDocumentsService.findAllByUserId(+id) };
  }

  @Get('/share/:id')
  @UseGuards(JwtAuthGuard)
  findAllSharedByDocumentId(@Req() req: Request, @Param('id') id: string) {
    return { data: this.sharedDocumentsService.findAllByDocumentId(+id) };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: CreateDocumentDto) {
    return { data: this.documentsService.create(data) };
  }

  @Post('/share')
  @UseGuards(JwtAuthGuard)
  share(@Body() data: CreateSharedDocumentDto) {
    return { data: this.sharedDocumentsService.create(data) };
  }

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: 'uploads/documents',
        filename: (req, file, cb) => {
          cb(null, Date.now() + '_' + file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(
            new UnprocessableEntityException(
              'Validation failed (expected type is pdf)',
            ),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async upload(
    @Req() req: Request,
    @Body() uploadDocumentDto: UploadDocumentDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'pdf',
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1000 * 2,
        })
        .build({
          exceptionFactory(error) {
            throw new UnprocessableEntityException(error);
          },
        }),
    )
    file: Express.Multer.File,
  ) {
    const id = +uploadDocumentDto.id;
    const document = await this.documentsService.findById(id);

    if (!document) {
      fs.unlinkSync(file.path);

      throw new NotFoundException('document not found');
    }

    const payload = req.user as JwtPayload;

    if (+payload.sub !== document.userId) {
      fs.unlinkSync(file.path);

      throw new ForbiddenException('unauthorized');
    }

    const updateDocument = await this.documentsService.update(id, {
      path: file.path,
    });

    return { data: updateDocument };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Body() data: UpdateDocumentDto, @Param() id: string) {
    if (data.isShareable === false) {
      this.sharedDocumentsService.deleteByDocumentId(+id);
    }

    return this.documentsService.update(+id, data);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param() id: string) {
    const document = await this.documentsService.findById(+id);

    if (!document) {
      throw new NotFoundException('document not found');
    }

    return { data: this.documentsService.delete(+id) };
  }

  @Delete('/share/:documentId/users/:userId')
  @UseGuards(JwtAuthGuard)
  async deleteSharedToUserId(
    @Param() documentId: string,
    @Param() userId: string,
  ) {
    const sharedDocument = await this.sharedDocumentsService.find(
      +documentId,
      +userId,
    );

    if (!sharedDocument) {
      throw new NotFoundException('shared document not found');
    }

    return { data: this.sharedDocumentsService.delete(+documentId, +userId) };
  }

  @Delete('/share/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSharedByDocumentId(@Param() id: string) {
    return {
      data: this.sharedDocumentsService.deleteByDocumentId(+id),
    };
  }
}
