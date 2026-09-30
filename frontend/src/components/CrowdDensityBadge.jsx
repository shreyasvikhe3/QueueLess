import React from 'react';
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const CrowdDensityBadge = ({ density }) => {
  if (!density) return null;

  const level = density.level || 'LOW';
  const badgeClass = level === 'HIGH' ? 'badge-high' : level === 'MEDIUM' ? 'badge-medium' : 'badge-low';

  const icon = level === 'HIGH' ? <AlertTriangle size={14} /> : level === 'MEDIUM' ? <Users size={14} /> : <CheckCircle2 size={14} />;

  return (
    <div className={`badge ${badgeClass}`}>
      {icon}
      {density.badgeText || `${level} Crowd Density`}
    </div>
  );
};
