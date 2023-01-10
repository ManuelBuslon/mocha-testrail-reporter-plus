export interface TestRailOptions {
  spec: string;
  tags?: string;
  excludeTags?: string;
  includeLastCommit?: boolean;
  addToName?: string;
}

export const Status = {
  passed: 1,
  pending: 2,
  untested: 3,
  retest: 4,
  failed: 5,
};

export interface TestRailResult {
  case_id: number;
  status_id: number;
  comment?: String;
}

export interface TestRailCase {
  id: number;
  title: string;
  section_id: number;
  template_id: number;
  type_id: number;
  priority_id: number;
  milestone_id?: number;
  refs?: string;
  created_by: number;
  created_on: number;
  updated_by: number;
  updated_on: number;
  estimate?: string;
  estimate_forecast?: string;
  suite_id: number;
  custom_preconds?: string;
  custom_steps?: string;
  custom_expected?: string;
  custom_steps_separated?: string;
  custom_mission?: string;
  custom_goals?: string;
}
