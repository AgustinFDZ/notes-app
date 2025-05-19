import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { transporter } from 'src/common/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    try {
      const user = this.userRepository.create({ ...userData, password: hashedPassword });
      const payload = { email: userData.email, id: user.id };
      const access_token = await this.jwtService.signAsync(payload);
      console.log(transporter);

      await transporter.sendMail({
        from: `"Notes App" <${process.env.EMAIL_USER}>`,
        to: userData.email,
        subject: 'Welcome to Notes App',
        text: `Hi, ${userData.username}! Welcome to Notes App. Your account has been created successfully.`,
      })

      const savedUser = await this.userRepository.save(user);

      return {
        savedUser,
        access_token
      }
    } catch (error) {
      console.log(error);

      if (error.code === '23505') {
        throw new NotFoundException('Email already exists');
      }
      throw new BadRequestException('Error creating user', error.message);
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new BadRequestException('Error fetching users', error.message);
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userRepository.update(id, updateUserDto);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return { message: 'User updated successfully' }
    } catch (error) {
      throw new BadRequestException('Error updating user', error.message);
    }
  }

  async delete(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' }
  }

  async softDelete(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.state = 'deleted';
    await this.userRepository.save(user);

    return { message: 'User deleted successfully' }
  }
}
