import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Ирина Бородина',
  })
  name: string;

  @ApiProperty({
    example: 'irina@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    example: '+79991234567',
    nullable: true,
  })
  phone: string | null;
}
