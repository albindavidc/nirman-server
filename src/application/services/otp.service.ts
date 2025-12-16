import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface OtpRecord {
  otp: string;
  expiresAt: Date;
  email: string;
}

@Injectable()
export class OtpService {
  private otpStore: Map<string, OtpRecord> = new Map();
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(OtpService.name);

  constructor() {
    // Configure Brevo SMTP transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_APP_PASSWORD,
      },
    });
  }

  generateOtp(): string {
    // Generate 6-digit random OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const otp = this.generateOtp();
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

      // Store OTP
      this.otpStore.set(email.toLowerCase(), {
        otp,
        expiresAt,
        email: email.toLowerCase(),
      });

      this.logger.log(`OTP sent to ${email}: ${otp}`);
      console.log(`OTP sent to ${email}: ${otp}`);  

      // Send email
      await this.transporter.sendMail({
        from: '"Nirman" <noreply@nirman.app>',
        to: email,
        subject: 'Your Nirman Verification Code',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1a1a; color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #E9C16C; margin: 0; font-size: 32px;">Nirman</h1>
              <p style="color: #888; margin-top: 8px;">Construction Management Platform</p>
            </div>
            
            <div style="background: #2a2a2a; border-radius: 16px; padding: 30px; text-align: center;">
              <h2 style="color: #ffffff; margin: 0 0 16px;">Verification Code</h2>
              <p style="color: #aaa; margin: 0 0 24px;">Enter this code to verify your email address</p>
              
              <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; display: inline-block;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #E9C16C;">${otp}</span>
              </div>
              
              <p style="color: #888; margin-top: 24px; font-size: 14px;">
                This code expires in <strong style="color: #E9C16C;">2 minutes</strong>
              </p>
            </div>
            
            <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        `,
      });

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, message: 'Failed to send OTP' };
    }
  }
  

  verifyOtp(email: string, otp: string): { valid: boolean; message: string } {
    const record = this.otpStore.get(email.toLowerCase());

    if (!record) {
      return { valid: false, message: 'No OTP found for this email' };
    }

    if (new Date() > record.expiresAt) {
      this.otpStore.delete(email.toLowerCase());
      return { valid: false, message: 'OTP has expired' };
    }

    if (record.otp !== otp) {
      return { valid: false, message: 'Invalid OTP' };
    }

    // OTP is valid, remove it from store
    this.otpStore.delete(email.toLowerCase());
    return { valid: true, message: 'OTP verified successfully' };
  }

  async resendOtp(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    // Delete existing OTP and send new one
    this.otpStore.delete(email.toLowerCase());
    return this.sendOtp(email);
  }
}
