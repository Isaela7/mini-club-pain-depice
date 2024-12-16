export type Class = 'CM2' | 'CM1' | 'CE2' | 'CE1' | 'CP' | 'PK4' | 'PK3' | 'PK2' | 'PK1';

export interface Student {
  id: string;
  lastName: string;
  firstName: string;
  class: Class;
}