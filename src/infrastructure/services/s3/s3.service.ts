import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export interface PresignedUrlResponse {
  url: string;
  key: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  viewUrl: string;
  key: string;
}

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.bucketName = process.env.AWS_BUCKET_NAME || '';
    this.region = process.env.AWS_REGION || 'eu-north-1';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    this.logger.log(`S3 Service initialized for bucket: ${this.bucketName}`);
  }

  /**
   * Generates presigned URLs for both uploading and viewing a file.
   * @param fileName - Original file name
   * @param fileType - MIME type (e.g., 'image/jpeg')
   * @param folder - Optional folder path (default: 'uploads')
   * @returns Upload URL, View URL, and the S3 key
   */
  async generateUploadUrl(
    fileName: string,
    fileType: string,
    folder: string = 'uploads',
  ): Promise<PresignedUploadResponse> {
    // Create a unique file name to prevent overwrites
    const extension = fileName.split('.').pop() || '';
    const key = `${folder}/${uuidv4()}.${extension}`;

    // Generate presigned PUT URL for upload (valid for 60 seconds)
    const putCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
    });
    const uploadUrl = await getSignedUrl(this.s3Client, putCommand, {
      expiresIn: 60,
    });

    // Generate presigned GET URL for viewing (valid for 7 days)
    const getCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const viewUrl = await getSignedUrl(this.s3Client, getCommand, {
      expiresIn: 604800, // 7 days in seconds
    });

    this.logger.log(`Generated presigned URLs for key: ${key}`);

    return { uploadUrl, viewUrl, key };
  }

  /**
   * Generates a presigned GET URL for viewing a file.
   * @param key - The S3 object key
   * @returns Presigned URL valid for 7 days
   */
  async generateViewUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 604800, // 7 days
    });
  }

  /**
   * Generates a presigned URL for profile photo uploads.
   * Files are stored in 'profiles/' folder.
   */
  async generateProfilePhotoUploadUrl(
    fileName: string,
    fileType: string,
  ): Promise<PresignedUploadResponse> {
    return this.generateUploadUrl(fileName, fileType, 'profiles');
  }

  /**
   * Generates a presigned URL for document uploads.
   * Files are stored in 'documents/' folder.
   */
  async generateDocumentUploadUrl(
    fileName: string,
    fileType: string,
  ): Promise<PresignedUploadResponse> {
    return this.generateUploadUrl(fileName, fileType, 'documents');
  }

  /**
   * Deletes a file from S3.
   * @param key - The S3 object key
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Deleted file: ${key}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file ${key}:`, error);
    }
  }

  /**
   * Extracts the S3 key from a full S3 URL or presigned URL.
   * @param url - Full S3 URL or presigned URL
   * @returns The S3 key or null if not a valid S3 URL
   */
  extractKeyFromUrl(url: string): string | null {
    if (!url) return null;

    try {
      // Handle presigned URLs or direct S3 URLs
      const urlObj = new URL(url);

      // S3 URL format: https://bucket.s3.region.amazonaws.com/key
      // or presigned: https://bucket.s3.region.amazonaws.com/key?X-Amz-...
      if (urlObj.hostname.includes('amazonaws.com')) {
        // Remove leading slash from pathname
        return urlObj.pathname.substring(1);
      }

      return null;
    } catch {
      // Not a valid URL
      return null;
    }
  }
}
