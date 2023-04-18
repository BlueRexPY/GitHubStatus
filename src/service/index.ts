import { statusColors } from '../consts';
import { ComponentsType, IData, StatusEnum } from '../types';

export const getComponents = (data: IData) =>
  data.components.reduce((acc, component) => {
    acc[component.status] = component.name;
    return acc;
  }, {} as ComponentsType);

export const getColor = (components: ComponentsType) => {
  const statusesList = Object.keys(components);
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
  const statusesList = Object.keys(components);

  if (statusesList.includes(StatusEnum.maintenance)) {
    text.push('Maintenance: ' + getValuesByKey(components, StatusEnum.maintenance).join(', '));
  }
  if (statusesList.includes(StatusEnum.degradedPerformance)) {
    text.push(
      'Degraded Performance: ' + getValuesByKey(components, StatusEnum.degradedPerformance).join(', '),
    );
  }
  if (statusesList.includes(StatusEnum.partialOutage)) {
    text.push('Partial Outage: ' + getValuesByKey(components, StatusEnum.partialOutage).join(', '));
  }
  if (statusesList.includes(StatusEnum.majorOutage)) {
    text.push('Major Outage: ' + getValuesByKey(components, StatusEnum.majorOutage).join(', '));
  }

  return text ? text.join('; ') : 'All systems operational';
};

const getValuesByKey = (obj: ComponentsType, key: StatusEnum) =>
  Object.keys(obj).reduce((acc, prop) => (prop === key ? [...acc, obj[prop]] : acc), new Array<string>());
