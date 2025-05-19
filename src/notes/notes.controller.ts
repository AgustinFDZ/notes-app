import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Injectable, ExecutionContext, CallHandler, UseInterceptors, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PaginationDto } from './dto';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
class LoggingInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log('Query Params:', request.query); // Log de los parámetros de consulta
    return next.handle();
  }
}

@Controller('notes')
@UseInterceptors(LoggingInterceptor)
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto);
    
    return this.notesService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete('erase/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.notesService.delete(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  softDelete(@Param('id') id: string) {
    return this.notesService.softDelete(+id);
  }
}
