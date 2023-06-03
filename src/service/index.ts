/* eslint-disable curly */
import { statusColors, statusText } from '../shared/consts';
import { ComponentsType, IData, StatusEnum } from '../shared/types';

export const getComponents = ({ components }: IData): ComponentsType =>
  components.reduce((acc, { name, status }) => ({ ...acc, [name]: status }), {});

export const getColor = (components: ComponentsType): string => {
  const colorMap: Record<StatusEnum, string> = {
    [StatusEnum.OPERATIONAL]: statusColors.operational,
    [StatusEnum.MAINTENANCE]: statusColors.maintenance,
    [StatusEnum.DEGRADED_PERFORMANCE]: statusColors.degradedPerformance,
    [StatusEnum.PARTIAL_OUTAGE]: statusColors.partialOutage,
    [StatusEnum.MAJOR_OUTAGE]: statusColors.majorOutage,
  };

  const statusPriorityList: StatusEnum[] = [
    StatusEnum.MAJOR_OUTAGE,
    StatusEnum.PARTIAL_OUTAGE,
    StatusEnum.DEGRADED_PERFORMANCE,
    StatusEnum.MAINTENANCE,
  ];

  for (const status of statusPriorityList) {
    if (status in components) return colorMap[status];
  }

  return colorMap[StatusEnum.OPERATIONAL];
};

export const getTooltipText = (components: ComponentsType): string => {
  const textMap: Record<StatusEnum, string> = {
    [StatusEnum.OPERATIONAL]: statusText.operational,
    [StatusEnum.MAINTENANCE]: statusText.maintenance,
    [StatusEnum.DEGRADED_PERFORMANCE]: statusText.degradedPerformance,
    [StatusEnum.PARTIAL_OUTAGE]: statusText.partialOutage,
    [StatusEnum.MAJOR_OUTAGE]: statusText.majorOutage,
  };

  const text = Object.entries(components)
    .filter(([, value]) => value !== StatusEnum.OPERATIONAL && value in textMap)
    .map(([key, value]) => `${textMap[value]}: ${key}`)
    .join(', ');

  return text || statusText.operational;
};
