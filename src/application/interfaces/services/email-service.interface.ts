/**
 * Email Service Interface
 * Port definition for email notifications.
 */
export interface IEmailService {
  sendEmail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean>;
  sendOtpEmail(email: string, otp: string): Promise<boolean>;
  sendPasswordResetEmail(email: string, otp: string): Promise<boolean>;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');
