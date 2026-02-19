export const API_PREFIX = 'api';
export const API_VERSION = 'v1';

export const AUTH_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/auth`,
  LOGIN: 'login',
  REFRESH: 'refresh',
  ME: 'me',
  LOGOUT: 'logout',
  FORGOT_PASSWORD: 'forgot-password',
  VERIFY_RESET_OTP: 'verify-reset-otp',
  RESET_PASSWORD: 'reset-password',
  WORKER_SIGNUP: 'worker/signup',
  SUPERVISOR_SIGNUP: 'supervisor/signup',
};

export const MEMBER_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/members`,
  GET_MEMBERS: '',
  ADD_MEMBER: '',
  EDIT_MEMBER: ':id',
  BLOCK_MEMBER: ':id/block',
  UNBLOCK_MEMBER: ':id/unblock',
};

export const PROFILE_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/profile`,
  GET_PROFILE: '',
  UPDATE_PROFILE: '',
  UPDATE_PASSWORD: 'password',
};

export const OTP_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/auth/otp`,
  SEND: 'send',
  VERIFY: 'verify',
  RESEND: 'resend',
};

export const VENDOR_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/vendors`,
  CREATE_VENDOR: '',
  GET_VENDORS: '',
  GET_STATS: 'stats',
  GET_VENDOR_BY_ID: ':id',
  UPDATE_VENDOR: ':id',
  UNBLACKLIST: ':id/unblacklist',
  REJECT: ':id/reject',
  REQUEST_RECHECK: ':id/request-recheck',
};

export const VENDOR_SIGNUP_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/auth/vendor/signup`,
  STEP_1: 'step1',
  STEP_2: 'step2',
};

export const UPLOAD_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/upload`,
  PROFILE_PHOTO: 'profile-photo',
  PRESIGNED_URL: 'presigned-url',
  DELETE_FILE: '*key',
};

export const PROJECT_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/projects`,
  CREATE_PROJECT: '',
  GET_PROJECTS: '',
  GET_STATS: 'stats',
  GET_PROFESSIONALS: 'professionals',
  GET_PROJECT_BY_ID: ':id',
  GET_ATTENDANCE: ':id/attendance',
  EXPORT_ATTENDANCE: ':id/attendance/export',
  UPDATE_PROJECT: ':id',
  DELETE_PROJECT: ':id',
  CREATE_PHASE: ':id/phases',
  GET_PHASES: ':id/phases',
  UPDATE_PHASE: ':id/phases/:phaseId',
  GET_MEMBERS: ':id/members',
  ADD_MEMBERS: ':id/members',
  REMOVE_MEMBER: ':id/members/:userId',
  UPDATE_MEMBER: ':id/members/:userId',
  // Phase Approvals
  GET_PHASE_APPROVAL: ':id/phases/:phaseId/approval',
  CREATE_PHASE_APPROVAL: ':id/phases/:phaseId/approval',
  REQUEST_PHASE_APPROVAL: ':id/phases/:phaseId/approval-request',
  GET_ALL_APPROVALS: 'approvals',
  GET_PROJECT_APPROVALS: ':id/approvals',
};

export const MATERIAL_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/materials`,
  GET_PROJECT_MATERIALS: 'project/:projectId',
  CREATE_MATERIAL: 'project/:projectId',
  UPDATE_MATERIAL: ':id',
  DELETE_MATERIAL: ':id',
  UPDATE_STOCK: ':id/stock',
  GET_TRANSACTIONS: ':id/transactions',
  CREATE_REQUEST: 'requests',
  GET_PROJECT_REQUESTS: 'project/:projectId/requests',
};

export const TASK_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/tasks`,
  GET_MY_TASKS: 'my-tasks',
  CREATE_TASK: '',
  GET_TASK_BY_ID: ':id',
  UPDATE_TASK: ':id',
  DELETE_TASK: ':id',
  GET_PROJECT_TASKS: 'project/:projectId',
  GET_PHASE_TASKS: 'phase/:phaseId',
  ADD_DEPENDENCY: 'dependencies',
  REMOVE_DEPENDENCY: 'dependencies/:id',
  GET_PROJECT_DEPENDENCIES: 'project/:projectId/dependencies',
  GET_PHASE_DEPENDENCIES: 'phase/:phaseId/dependencies',
};

export const ATTENDANCE_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/projects/:projectId/attendance`,
  CHECK_IN: 'check-in',
  CHECK_OUT: 'check-out',
  GET_MY_HISTORY: 'me/history',
  GET_MY_STATS: 'me/stats',
  GET_PROJECT_ATTENDANCE: '',
  GET_PROJECT_STATS: 'stats',
};
