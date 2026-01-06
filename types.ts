
export enum CaseStatus {
  OPEN = 'OPEN',
  CONTRIBUTING = 'CONTRIBUTING',
  LOCKED = 'LOCKED',
  PAID = 'PAID',
  RELEASED = 'RELEASED',
  CLOSED = 'CLOSED'
}

export type ContributorType = 'Family' | 'NGO' | 'Community' | 'Legal Aid';
export type BailType = 'Cash Bail' | 'Bond' | 'Court Fine';
export type CaseCategory = 'Bail' | 'Fine';

export interface Contribution {
  id: string;
  contributorName: string;
  contributorType: ContributorType;
  amount: number;
  timestamp: string;
  mpesaRef: string;
  status: 'Verified' | 'Pending';
}

export interface BailCase {
  id: string;
  obNumber: string;
  detaineeName: string;
  detaineePhone: string;
  detaineeImage?: string; // Base64 encoded image
  nationalId?: string;
  gender: 'Male' | 'Female' | 'Other';
  ageRange: 'Juvenile' | 'Adult';
  offence: string;
  offenceCategory: string;
  caseCategory: CaseCategory; // New field to distinguish Bail vs Fine
  bailType: BailType;
  bailAmount: number;
  amountRaised: number;
  status: CaseStatus;
  station: string;
  courtName: string;
  expectedCourtDate: string;
  arrestDateTime: string;
  timestamp: string;
  contributions: Contribution[];
  lockedBy?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'Desk Officer' | 'OCS' | 'Admin';
  station?: string;
}
