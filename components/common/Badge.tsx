
import React from 'react';
import { CaseStatus } from '../../types';
import { STATUS_COLORS } from '../../constants';

interface BadgeProps {
  status: CaseStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[status]}`}>
    {status}
  </span>
);
