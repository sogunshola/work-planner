import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../entities/users.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEnum(Role)
  @IsOptional()
  public role: Role;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEnum(Role)
  @IsOptional()
  public role: Role;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
