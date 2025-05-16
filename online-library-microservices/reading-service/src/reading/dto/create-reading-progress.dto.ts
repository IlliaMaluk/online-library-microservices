import { IsUUID, IsInt, Min, Max, IsNumber } from 'class-validator';

export class CreateReadingProgressDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  book_id: string;

  @IsInt()
  @Min(0)
  current_page: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentage_read: number;
}
