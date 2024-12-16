// Configuration de l'API
export const API_CONFIG = {
  API_KEY: process.env.API_KEY || 'sk_miniclub_123456789',
  ENDPOINTS: {
    ATTENDANCE: '/api/attendance',
    STUDENTS: '/api/students',
    SYNC_STATUS: '/api/sync/status'
  }
};