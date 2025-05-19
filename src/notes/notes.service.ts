import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto, UpdateNoteDto, PaginationDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
  ) { }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {

    try {
      const note = this.notesRepository.create(createNoteDto);
      return await this.notesRepository.save(note);

    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('A note with this title already exists');
      }
      throw new BadRequestException('Error creating note', error.message);
    }

  }

  async findAll(paginationDto: PaginationDto): Promise<{ data: Note[], total: number, page: number, limit: number }> {
    const { page, limit } = paginationDto;

    const [data, total] = await this.notesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (data.length === 0) {
      throw new NotFoundException('No notes found');
    }

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Note | string> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new BadRequestException('Note not found');
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<{ message: string }> {

    try {
      const result = await this.notesRepository.update(id, updateNoteDto);
      if (result.affected === 0) {
        throw new NotFoundException('Note not found');
      }
      return { message: `Note with id ${id} updated successfully` };
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('A note with this title already exists');
      }
      throw new BadRequestException('Error updating note', error.message);
    }

  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Note not found');
    }

    return { message: `Note with id ${id} deleted successfully` };
  }

  async softDelete(id: number): Promise<{ message: string }> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    note.state = 'deleted';

    await this.notesRepository.save(note);
    return { message: `Note with id ${id} deleted successfully` };
  }
}
