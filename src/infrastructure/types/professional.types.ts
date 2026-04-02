export interface ProfessionalPersistence {
  id: string;
  userId: string;
  professionalTitle: string;
  experienceYears: number;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    profilePhotoUrl: string | null;
  };
}

export interface ProfessionalWherePersistenceInput {
  OR?: Array<
    | { professionalTitle: { contains: string; mode: 'insensitive' } }
    | {
        user: {
          is: {
            firstName?: { contains: string; mode: 'insensitive' };
            lastName?: { contains: string; mode: 'insensitive' };
            email?: { contains: string; mode: 'insensitive' };
          };
        };
      }
  >;
  userId?: { notIn: string[] } | { in: string[] };
  user?: {
    is: {
      userStatus?: string;
      isDeleted?: boolean;
    };
  };
}
