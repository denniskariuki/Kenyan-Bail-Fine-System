
import React from 'react';
import { CaseStatus } from './types';

export const STATUS_COLORS: Record<CaseStatus, string> = {
  [CaseStatus.OPEN]: 'bg-blue-100 text-blue-700 border-blue-200',
  [CaseStatus.CONTRIBUTING]: 'bg-amber-100 text-amber-700 border-amber-200',
  [CaseStatus.LOCKED]: 'bg-purple-100 text-purple-700 border-purple-200',
  [CaseStatus.PAID]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [CaseStatus.RELEASED]: 'bg-slate-100 text-slate-700 border-slate-200',
  [CaseStatus.CLOSED]: 'bg-red-100 text-red-700 border-red-200',
};

export const OFFENCE_CATEGORIES = [
  "Traffic Offence",
  "Public Nuisance",
  "Minor Theft",
  "Assault (Minor)",
  "Breach of Peace",
  "Other Bailable Misdemeanor"
];

export const BAIL_TYPES = ["Cash Bail", "Bond", "Court Fine"];
export const CASE_CATEGORIES = ["Bail", "Fine"];

export const MOCK_STATIONS = [
  "Central Police Station - Nairobi",
  "Kilimani Police Station",
  "Pangani Police Station",
  "Lang'ata Police Station"
];

export const KENYA_EMBLEM = (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);
