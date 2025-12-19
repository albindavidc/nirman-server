export class ResetPasswordCommand {
  constructor(
    public readonly email: string,
    public readonly resetToken: string,
    public readonly newPassword: string,
  ) {}
}
