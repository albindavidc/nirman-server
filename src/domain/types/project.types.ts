export interface ProjectWorker {
  userId: string;
  role:
    | 'Admin'
    | 'Viewer'
    | 'Worker'
    | 'Supervisor'
    | 'Engineer'
    | 'Foreman'
    | 'Technician'
    | (string & {});
  joinedAt: Date;
  isCreator: boolean;
}
