export interface ProfessionalPersistence {
  id: string;
  user_id: string;
  professional_title: string;
  experience_years: number;
  skills: string[];
  created_at: Date;
  updated_at: Date;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_photo_url: string | null;
  };
}

export interface ProfessionalWherePersistenceInput {
  OR?: Array<
    | { professional_title: { contains: string; mode: 'insensitive' } }
    | {
        user: {
          is: {
            first_name?: { contains: string; mode: 'insensitive' };
            last_name?: { contains: string; mode: 'insensitive' };
            email?: { contains: string; mode: 'insensitive' };
          };
        };
      }
  >;
  user_id?: { notIn: string[] } | { in: string[] };
  user?: {
    is: {
      user_status?: string;
      is_deleted?: boolean;
    };
  };
}
