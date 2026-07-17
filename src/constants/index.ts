export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ROLES = {
  ADMIN: 'ADMIN',
  COMPANY: 'COMPANY',
} as const;

export const APP_NAME = "Project Safe Hire";