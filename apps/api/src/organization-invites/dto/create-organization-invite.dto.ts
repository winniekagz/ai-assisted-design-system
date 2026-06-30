import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class CreateOrganizationInviteDto {
  @ApiProperty({
    example: 'engineer@example.com',
    description: 'Email address invited to the organization.',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: Role,
    example: Role.ENGINEER,
    description: 'Role offered to the invited user.',
  })
  @IsEnum(Role)
  role!: Role;
}
