import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEpicDto {
  @ApiProperty({ example: 'Authentication Sprint' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'All auth-related work' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '#4186f4' })
  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateEpicDto {
  @ApiPropertyOptional({ example: 'Authentication Sprint' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'All auth-related work' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '#4186f4' })
  @IsString()
  @IsOptional()
  color?: string;
}
