import { store } from '../models/store.js';

export function calculateCrowdDensity(serviceId) {
  const activeTokens = store.tokens.filter(
    t => t.serviceId === serviceId && ['WAITING', 'CHECKED_IN', 'CALLED', 'SERVING'].includes(t.status)
  );

  const checkedInCount = activeTokens.filter(t => t.status === 'CHECKED_IN').length;
  const servingCount = activeTokens.filter(t => t.status === 'SERVING' || t.status === 'CALLED').length;
  const waitingCount = activeTokens.filter(t => t.status === 'WAITING').length;

  const totalActive = activeTokens.length;

  let level = 'LOW';
  let color = 'GREEN'; // 🟢
  let badgeText = 'Low Density';

  if (totalActive >= 15 || checkedInCount >= 8) {
    level = 'HIGH';
    color = 'RED'; // 🔴
    badgeText = 'High Density';
  } else if (totalActive >= 6 || checkedInCount >= 3) {
    level = 'MEDIUM';
    color = 'YELLOW'; // 🟡
    badgeText = 'Medium Density';
  }

  return {
    level,
    color,
    badgeText,
    metrics: {
      totalActiveTokens: totalActive,
      waitingCount,
      checkedInCount,
      servingCount
    }
  };
}
