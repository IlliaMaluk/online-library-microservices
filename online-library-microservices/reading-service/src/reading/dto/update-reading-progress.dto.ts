import { PartialType } from '@nestjs/mapped-types';
import { CreateReadingProgressDto } from './create-reading-progress.dto';

export class UpdateReadingProgressDto extends PartialType(CreateReadingProgressDto) {}
