export class AddMemberCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly role: string, // 'admin', 'professional', 'worker', (vendor is handled separately usually, but could be here)
    // Optional fields for professional
    public readonly professionalTitle?: string,
    public readonly experienceYears?: number,
    public readonly skills?: string[],
    public readonly addressStreet?: string,
    public readonly addressCity?: string,
    public readonly addressState?: string,
    public readonly addressZipCode?: string,
  ) {}
}
