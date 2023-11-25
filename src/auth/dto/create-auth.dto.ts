import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TransformLowerCase } from 'src/utils/decorators';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty()
  @TransformLowerCase()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
