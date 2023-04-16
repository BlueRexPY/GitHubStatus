import { statusColors } from '../consts';
import { ComponentsType, IData, StatusEnum } from '../types';

export const getComponents = (data: IData) =>
  data.components.reduce((acc, component) => {
    acc[component.status] = component.name;
    return acc;
  }, {} as ComponentsType);

export const getColor = (components: ComponentsType) => {
  const statusesList = Object.keys(components);

  if (statusesList.includes(StatusEnum.maintenance)) {
    return statusColors.maintenance;
  }
  if (statusesList.includes(StatusEnum.degradedPerformance)) {
    return statusColors.degradedPerformance;
  }

  if (statusesList.includes(StatusEnum.partialOutage)) {
    return statusColors.partialOutage;
  }

  if (statusesList.includes(StatusEnum.majorOutage)) {
    return statusColors.majorOutage;
  }

  return 'none';
};

export const getTooltipText = (components: ComponentsType) => {
  let text = '';
  const statusesList = Object.keys(components);

  if (statusesList.includes(StatusEnum.maintenance)) {
    text += 'Maintenance: ' + getValuesByKey(components, StatusEnum.maintenance).join(', ');
  }
  if (statusesList.includes(StatusEnum.degradedPerformance)) {
    text += 'Degraded Performance: ' + getValuesByKey(components, StatusEnum.degradedPerformance).join(', ');
  }
  if (statusesList.includes(StatusEnum.partialOutage)) {
    text += 'Partial Outage: ' + getValuesByKey(components, StatusEnum.partialOutage).join(', ');
  }
  if (statusesList.includes(StatusEnum.majorOutage)) {
    text += 'Major Outage: ' + getValuesByKey(components, StatusEnum.majorOutage).join(', ');
  }

  return text ? text : 'All systems operational';
};

const getValuesByKey = (obj: ComponentsType, key: StatusEnum) =>
  Object.keys(obj).reduce((acc, prop) => (prop === key ? [...acc, obj[prop]] : acc), new Array<string>());
