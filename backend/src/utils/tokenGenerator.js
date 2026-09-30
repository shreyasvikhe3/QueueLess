import { store } from '../models/store.js';

export function generateNextTokenNumber(serviceId) {
  const service = store.services.find(s => s.serviceId === serviceId);
  const prefix = service ? service.prefix : 'T';

  // Find all tokens issued for this service today
  const existingTokens = store.tokens.filter(t => t.serviceId === serviceId);
  let maxNum = 100;

  for (const token of existingTokens) {
    const numStr = token.tokenNumber.replace(prefix, '');
    const num = parseInt(numStr, 10);
    if (!isNaN(num) && num > maxNum) {
      maxNum = num;
    }
  }

  const nextNum = maxNum + 1;
  return `${prefix}${nextNum}`;
}
