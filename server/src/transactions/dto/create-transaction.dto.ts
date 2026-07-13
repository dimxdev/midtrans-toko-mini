import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @Min(1)
  produkId: number;

  @IsString()
  @IsNotEmpty()
  namaPembeli: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  noHp: string;
}
