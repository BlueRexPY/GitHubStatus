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
  OPERATIONAL = 'operational',
  DEGRADED_PERFORMANCE = 'degraded_performance',
  PARTIAL_OUTAGE = 'partial_outage',
  MAJOR_OUTAGE = 'major_outage',
  MAINTENANCE = 'maintenance',
}

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
