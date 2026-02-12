import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

import { IEmailService } from '../../../application/interfaces/email-service.interface';

@Injectable()
export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // Configure Brevo SMTP transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: '"Nirman" <noreply@nirman.app>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    const html = `
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
    `;

    // Log OTP for testing
    this.logger.log(`📧 Verification OTP for ${email}: ${otp}`);
    console.log(`\n🔐 VERIFICATION OTP for ${email}: ${otp}\n`);

    return this.sendEmail({
      to: email,
      subject: 'Your Nirman Verification Code',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, otp: string): Promise<boolean> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1a1a; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E9C16C; margin: 0; font-size: 32px;">Nirman</h1>
          <p style="color: #888; margin-top: 8px;">Construction Management Platform</p>
        </div>
        
        <div style="background: #2a2a2a; border-radius: 16px; padding: 30px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0 0 16px;">Password Reset Code</h2>
          <p style="color: #aaa; margin: 0 0 24px;">Use this code to reset your password</p>
          
          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; display: inline-block;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #E9C16C;">${otp}</span>
          </div>
          
          <p style="color: #888; margin-top: 24px; font-size: 14px;">
            This code expires in <strong style="color: #E9C16C;">2 minutes</strong>
          </p>
        </div>
        
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          If you didn't request this password reset, please ignore this email or contact support if you have concerns.
        </p>
      </div>
    `;

    // Log OTP for testing
    this.logger.log(`📧 Password Reset OTP for ${email}: ${otp}`);
    console.log(`\n🔐 PASSWORD RESET OTP for ${email}: ${otp}\n`);

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Nirman Password',
      html,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1a1a; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E9C16C; margin: 0; font-size: 32px;">Nirman</h1>
          <p style="color: #888; margin-top: 8px;">Construction Management Platform</p>
        </div>
        
        <div style="background: #2a2a2a; border-radius: 16px; padding: 30px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0 0 16px;">Welcome to Nirman!</h2>
          <p style="color: #aaa; margin: 0 0 24px;">Hello ${firstName}, we're excited to have you on board!</p>
          
          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; text-align: left;">
            <p style="color: #E9C16C; font-weight: bold; margin: 0 0 12px;">Getting Started:</p>
            <ul style="color: #aaa; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Complete your profile setup</li>
              <li>Explore our construction management tools</li>
              <li>Connect with your team members</li>
            </ul>
          </div>
          
          <p style="color: #888; margin-top: 24px; font-size: 14px;">
            Need help? Our support team is here for you.
          </p>
        </div>
        
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          Thank you for choosing Nirman for your construction management needs.
        </p>
      </div>
    `;

    this.logger.log(`📧 Welcome email sent to ${email}`);
    console.log(`\n🎉 WELCOME EMAIL sent to ${email}\n`);

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Nirman - Get Started!',
      html,
    });
  }
}
