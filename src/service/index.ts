import { statusColors } from '../shared/consts';
import { ComponentsType, IData, StatusEnum } from '../shared/types';

export const getComponents = ({ components }: IData): ComponentsType =>
  components.reduce((acc, { name, status }) => ({ ...acc, [name]: status }), {});

export const getColor = (components: ComponentsType) => {
  const statusesList = Object.values(components);
  let color = 'none';

  if (statusesList.includes(StatusEnum.MAINTENANCE)) {
    color = statusColors.maintenance;
  }
  if (statusesList.includes(StatusEnum.DEGRADED_PERFORMANCE)) {
    color = statusColors.degradedPerformance;
  }

  if (statusesList.includes(StatusEnum.PARTIAL_OUTAGE)) {
    color = statusColors.partialOutage;
  }

  if (statusesList.includes(StatusEnum.MAJOR_OUTAGE)) {
    color = statusColors.majorOutage;
  }

  return color;
};

export const getTooltipText = (components: ComponentsType) => {
  let text = new Array<string>();
  const statusesList = Object.values(components);

  if (statusesList.includes(StatusEnum.MAINTENANCE)) {
    text.push('Maintenance: ' + getValuesByStatus(components, StatusEnum.MAINTENANCE).join(', '));
  }
  if (statusesList.includes(StatusEnum.DEGRADED_PERFORMANCE)) {
    text.push(
      'Degraded Performance: ' + getValuesByStatus(components, StatusEnum.DEGRADED_PERFORMANCE).join(', '),
    );
  }
  if (statusesList.includes(StatusEnum.PARTIAL_OUTAGE)) {
    text.push('Partial Outage: ' + getValuesByStatus(components, StatusEnum.PARTIAL_OUTAGE).join(', '));
  }
  if (statusesList.includes(StatusEnum.MAJOR_OUTAGE)) {
    text.push('Major Outage: ' + getValuesByStatus(components, StatusEnum.MAJOR_OUTAGE).join(', '));
  }

  return text.length ? text.join('; ') : 'All systems operational';
};

const getValuesByStatus = (obj: ComponentsType, status: StatusEnum): string[] =>
  Object.entries(obj)
    .filter(([_, value]) => value === status)
    .map(([key]) => key);
