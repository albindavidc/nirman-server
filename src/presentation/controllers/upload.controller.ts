import {
  Controller,
  Post,
  UseGuards,
  BadRequestException,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import { UPLOAD_ROUTES } from '../../app.routes';
import {
  S3Service,
  PresignedUploadResponse,
} from '../../infrastructure/services/s3/s3.service';
import { GeneratePresignedUrlDto } from '../../application/dto/upload/presigned-url.dto';

@Controller(UPLOAD_ROUTES.ROOT)
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  /**
   * Generate presigned URLs for direct S3 upload and viewing.
   * The frontend uses these URLs to:
   * 1. Upload file directly to S3 using uploadUrl
   * 2. Store viewUrl in profile (for displaying the image)
   *
   * Flow:
   * 1. Frontend calls this endpoint with fileName and fileType
   * 2. Backend returns uploadUrl (60s validity) and viewUrl (7 days validity)
   * 3. Frontend uploads the file directly to S3 using PUT request
   * 4. Frontend saves the viewUrl to the user profile
   */
  @Post(UPLOAD_ROUTES.PRESIGNED_URL)
  async getPresignedUrl(
    @Body() dto: GeneratePresignedUrlDto,
  ): Promise<PresignedUploadResponse> {
    // Validate file type for images
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedTypes.includes(dto.fileType)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      );
    }

    // Generate presigned URLs based on upload type
    if (dto.uploadType === 'document') {
      return this.s3Service.generateDocumentUploadUrl(
        dto.fileName,
        dto.fileType,
      );
    }

    // Default to profile photo upload
    return this.s3Service.generateProfilePhotoUploadUrl(
      dto.fileName,
      dto.fileType,
    );
  }

  /**
   * Delete a file from S3.
   * @param key - The S3 object key (e.g., 'profiles/uuid.jpg')
   */
  @Delete('*key')
  async deleteFile(@Param('key') key: string): Promise<{ message: string }> {
    await this.s3Service.deleteFile(key);
    return { message: 'File deleted successfully' };
  }
}
