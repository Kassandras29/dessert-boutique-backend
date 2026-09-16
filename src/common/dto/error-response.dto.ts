import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP-код ошибки',
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Описание ошибки',
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: { type: 'string' },
      },
    ],
  })
  message: string | string[];

  @ApiProperty({
    description: 'Путь запроса, на котором возникла ошибка',
    type: String,
  })
  path: string;

  @ApiProperty({
    description: 'Время возникновения ошибки',
    type: String,
    format: 'date-time',
  })
  timestamp: string;
}
