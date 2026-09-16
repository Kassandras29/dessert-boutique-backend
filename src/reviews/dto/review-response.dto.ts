import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from '../../customers/dto/customer-response.dto';

export class ReviewDessertResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Молочная девочка',
  })
  name: string;
}

export class ReviewResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    example: 'Очень вкусный десерт!',
  })
  text: string;

  @ApiProperty({
    example: '2026-09-16T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: 1,
  })
  customerId: number;

  @ApiProperty({
    example: 1,
  })
  dessertId: number;

  @ApiProperty({
    type: CustomerResponseDto,
  })
  customer: CustomerResponseDto;

  @ApiProperty({
    type: ReviewDessertResponseDto,
  })
  dessert: ReviewDessertResponseDto;
}
