import { statusColors } from '../shared/consts';
import { ComponentsType, IData, StatusEnum } from '../shared/types';

export const getComponents = (data: IData) =>
  data.components.reduce((acc, component) => {
    acc[component.name] = component.status;
    return acc;
  }, {} as ComponentsType);

export const getColor = (components: ComponentsType) => {
  const statusesList = Object.values(components);
  let color = 'none';

  if (statusesList.includes(StatusEnum.maintenance)) {
    color = statusColors.maintenance;
  }
  if (statusesList.includes(StatusEnum.degradedPerformance)) {
    color = statusColors.degradedPerformance;
  }

  if (statusesList.includes(StatusEnum.partialOutage)) {
    color = statusColors.partialOutage;
  }

  if (statusesList.includes(StatusEnum.majorOutage)) {
    color = statusColors.majorOutage;
  }

  return color;
};

export const getTooltipText = (components: ComponentsType) => {
  let text = new Array<string>();
  const statusesList = Object.values(components);

  if (statusesList.includes(StatusEnum.maintenance)) {
    text.push('Maintenance: ' + getValuesByStatus(components, StatusEnum.maintenance).join(', '));
  }
  if (statusesList.includes(StatusEnum.degradedPerformance)) {
    text.push(
      'Degraded Performance: ' + getValuesByStatus(components, StatusEnum.degradedPerformance).join(', '),
    );
  }
  if (statusesList.includes(StatusEnum.partialOutage)) {
    text.push('Partial Outage: ' + getValuesByStatus(components, StatusEnum.partialOutage).join(', '));
  }
  if (statusesList.includes(StatusEnum.majorOutage)) {
    text.push('Major Outage: ' + getValuesByStatus(components, StatusEnum.majorOutage).join(', '));
  }

  return text.length ? text.join('; ') : 'All systems operational';
};

const getValuesByStatus = (obj: ComponentsType, status: StatusEnum): string[] =>
  Object.entries(obj)
    .filter(([_, value]) => value === status)
    .map(([key]) => key);
