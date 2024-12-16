export interface InviteCode {
  id: string;
  code: string;
  email: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
  createdAt: string;
}

export interface Animator {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isActive: boolean;
}