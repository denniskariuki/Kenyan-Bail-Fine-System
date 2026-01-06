
import { BailCase, CaseStatus } from '../types';

export const INITIAL_CASES: BailCase[] = [
  {
    id: 'BC-9921',
    obNumber: 'OB 12/05/2024',
    detaineeName: 'John Kamau',
    detaineePhone: '0712345678',
    gender: 'Male',
    ageRange: 'Adult',
    offence: 'Public Nuisance',
    offenceCategory: 'Public Nuisance',
    // Added missing required property caseCategory
    caseCategory: 'Bail',
    bailType: 'Cash Bail',
    bailAmount: 5000,
    amountRaised: 1500,
    status: CaseStatus.CONTRIBUTING,
    station: 'Kilimani Police Station',
    courtName: 'Kibera Law Courts',
    expectedCourtDate: '2024-05-15',
    arrestDateTime: '2024-05-12T09:00:00Z',
    timestamp: '2024-05-12T10:30:00Z',
    contributions: [
      {
        id: 'C1',
        contributorName: 'Mary Wanjiku',
        contributorType: 'Family',
        amount: 1500,
        timestamp: '2024-05-12T11:00:00Z',
        mpesaRef: 'RE92K81S9L',
        status: 'Verified'
      }
    ]
  },
  {
    id: 'BC-9925',
    obNumber: 'OB 04/05/2024',
    detaineeName: 'Sarah Atieno',
    detaineePhone: '0722000111',
    gender: 'Female',
    ageRange: 'Adult',
    offence: 'Minor Traffic Offence',
    offenceCategory: 'Traffic Offence',
    // Added missing required property caseCategory
    caseCategory: 'Bail',
    bailType: 'Cash Bail',
    bailAmount: 2000,
    amountRaised: 2000,
    status: CaseStatus.PAID,
    station: 'Central Police Station - Nairobi',
    courtName: 'Milimani Law Courts',
    expectedCourtDate: '2024-05-13',
    arrestDateTime: '2024-05-12T07:30:00Z',
    timestamp: '2024-05-12T08:15:00Z',
    contributions: [
      {
        id: 'C2',
        contributorName: 'Haki Foundation',
        contributorType: 'NGO',
        amount: 2000,
        timestamp: '2024-05-12T09:00:00Z',
        mpesaRef: 'QF12X81A0P',
        status: 'Verified'
      }
    ]
  }
];
