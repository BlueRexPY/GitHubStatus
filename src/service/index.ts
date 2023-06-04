/* eslint-disable curly */
import { priorityList, statusColors, statusText } from '../shared/consts';
import { ComponentsType, ExcludedOperationalType, IData, StatusEnum } from '../shared/types';

export const getComponents = ({ components }: IData): ComponentsType =>
  components.reduce((acc, { name, status }) => ({ ...acc, [name]: status }), {});

export const getColor = (components: ComponentsType) => {
  const statusesList = getStatuses(components);

  for (const status of priorityList)
    if (statusesList.includes(status)) return statusColors[getKeyByValue(status)];

  return statusColors.operational;
};

export const getTooltipText = (components: ComponentsType) => {
  let text = new Array<string>();
  const statusesList = getStatuses(components);

  priorityList.forEach((status) => {
    if (statusesList.includes(status))
      text.push(formatStatus(status) + ': ' + getValuesByStatus(components, status).join(', '));
  });

  return text.length ? text.join('; ') : statusText.operational;
};

const getValuesByStatus = (obj: ComponentsType, status: StatusEnum): string[] =>
  Object.entries(obj)
    .filter(([_, value]) => value === status)
    .map(([key]) => key);

const formatStatus = (status: ExcludedOperationalType) => {
  const formattedStatus = status
    .replace(/([A-Z])/g, ' $1') // insert a space before all caps
    .replace(/_/g, ' '); // replace underscores with spaces
  return formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1); // capitalize the first letter
};

const getStatuses = (components: ComponentsType) => Object.values(components) as ExcludedOperationalType[];

const getKeyByValue = (value: ExcludedOperationalType): keyof typeof StatusEnum => {
  return (Object.keys(StatusEnum) as Array<keyof typeof StatusEnum>).find(
    (key) => StatusEnum[key] === value,
  )!;
};
