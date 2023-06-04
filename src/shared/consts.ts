import { ExcludedOperationalType, StatusEnum } from './types';

export const statusColors = {
  majorOutage: 'red',
  partialOutage: 'orange',
  degradedPerformance: 'yellow',
  maintenance: 'blue',
  operational: 'none',
};

export const statusText = {
  majorOutage: 'Major Outage',
  partialOutage: 'Partial Outage',
  degradedPerformance: 'Degraded Performance',
  maintenance: 'Maintenance',
  operational: 'All systems operational',
};

export const defaultInterval = 5; // minutes
export const loadingText = 'Loading...';
export const extensionLogo = '$(github-inverted)';

export const priorityList: readonly ExcludedOperationalType[] = Object.freeze([
  StatusEnum.majorOutage,
  StatusEnum.partialOutage,
  StatusEnum.degradedPerformance,
  StatusEnum.maintenance,
]);

export const errorText = 'An error occurred. Please reload the IDE.';
