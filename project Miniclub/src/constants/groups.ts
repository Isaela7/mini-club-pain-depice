export interface Group {
  id: string;
  name: string;
  period: string;
}

export const GROUPS: Group[] = [
  { id: 'cm-ce2-matin', name: 'CM/CE2', period: 'Matin' },
  { id: 'cm-ce2-apm', name: 'CM/CE2', period: 'APM' },
  { id: 'ce1-cp-matin', name: 'CE1/CP', period: 'Matin' },
  { id: 'ce1-cp-apm', name: 'CE1/CP', period: 'APM' },
  { id: 'pk34-matin', name: 'PK3&4', period: 'Matin' },
  { id: 'pk34-apm', name: 'PK3&4', period: 'APM' },
  { id: 'pk12-matin', name: 'PK1&2', period: 'Matin' },
  { id: 'pk12-apm', name: 'PK1&2', period: 'APM' }
];