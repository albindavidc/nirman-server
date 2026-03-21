export interface ProjectWorker {
  userId: string;
  role:
    | 'Admin'
    | 'Worker'
    | 'Supervisor'
    | 'Engineer'
    | 'Foreman'
    | 'Technician'
    | (string & {});
  joinedAt: Date;
  isCreator: boolean;
}
