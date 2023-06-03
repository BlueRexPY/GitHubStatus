import { statusColors, statusText } from '../shared/consts';
import { ComponentsType, IData, StatusEnum } from '../shared/types';

export const getComponents = (data: IData): ComponentsType =>
  data.components.reduce((acc, { name, status }) => ({ ...acc, [name]: status }), {});

export const getColor = (components: ComponentsType): string => {
  const statusesList = Object.values(components);
  const colorMap: Record<StatusEnum, string> = {
    [StatusEnum.OPERATIONAL]: statusColors.operational,
    [StatusEnum.MAINTENANCE]: statusColors.maintenance,
    [StatusEnum.DEGRADED_PERFORMANCE]: statusColors.degradedPerformance,
    [StatusEnum.PARTIAL_OUTAGE]: statusColors.partialOutage,
    [StatusEnum.MAJOR_OUTAGE]: statusColors.majorOutage,
  };

  const color = statusesList.find((status) => status in colorMap);
  return color ? colorMap[color] : statusColors.operational;
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
    .filter(([, value]) => value in textMap && value !== StatusEnum.OPERATIONAL)
    .map(([key, value]) => `${textMap[value]}: ${key}`)
    .join(', ');

  return text || 'All systems operational';
};
