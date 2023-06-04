/* eslint-disable @typescript-eslint/naming-convention */
export interface IData {
  page: IPage;
  components: IComponent[];
  incidents: any[];
  scheduled_maintenances: any[];
  status: IStatusClass;
}

export interface IComponent {
  id: string;
  name: string;
  status: StatusEnum;
  created_at: Date;
  updated_at: Date;
  position: number;
  description: null | string;
  showcase: boolean;
  start_date: Date | null;
  group_id: null;
  page_id: string;
  group: boolean;
  only_show_if_degraded: boolean;
}

export type ID = string;

export enum StatusEnum {
  majorOutage = 'major_outage',
  partialOutage = 'partial_outage',
  degradedPerformance = 'degraded_performance',
  maintenance = 'maintenance',
  operational = 'operational',
}

export type ExcludedOperationalType = Exclude<StatusEnum, 'operational'>;

export interface IPage {
  id: ID;
  name: string;
  url: string;
  time_zone: string;
  updated_at: Date;
}

export interface IStatusClass {
  indicator: string;
  description: string;
}

export type ComponentsType = Record<string, StatusEnum>;
