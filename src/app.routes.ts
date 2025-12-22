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
};

export const VENDOR_SIGNUP_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/auth/vendor/signup`,
  STEP_1: 'step1',
  STEP_2: 'step2',
};

export const UPLOAD_ROUTES = {
  ROOT: `${API_PREFIX}/${API_VERSION}/upload`,
  PROFILE_PHOTO: 'profile-photo',
};
