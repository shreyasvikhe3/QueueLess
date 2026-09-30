export class FallbackWaitService {
  static estimateWaitTime({ peopleAhead, activeCounters, averageServiceTime }) {
    const safeCounters = Math.max(activeCounters || 1, 1);
    const avgTime = averageServiceTime || 5;
    
    // Formula: (peopleAhead * averageServiceTime) / activeCounters
    const estimatedMinutes = Math.round((peopleAhead * avgTime) / safeCounters);
    
    const minRange = Math.max(0, Math.floor(estimatedMinutes * 0.8));
    const maxRange = Math.ceil(estimatedMinutes * 1.2) + 2;

    return {
      predictedWaitingMinutes: estimatedMinutes,
      confidenceRange: `${minRange}-${maxRange} minutes`,
      source: 'FALLBACK_STATISTICAL_MODEL'
    };
  }
}
