import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    example: 4,
    description: 'Оценка от 1 до 5',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Очень понравилось!',
    description: 'Текст отзыва',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    example: 1,
    description: 'Идентификатор клиента',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  customerId: number;

  @ApiProperty({
    example: 2,
    description: 'Идентификатор десерта',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  dessertId: number;
}
