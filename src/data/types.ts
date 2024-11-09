export interface RecallData {
  MAKER: string;
  MODEL: string;
  "VEHIC-YEAR": number;
  COMPONENT: string;
  RECALL_TYPE: string;
  RECALL_DATE: Date;
  DEFECT_SUMMARY: string;
  CONSEQ_SUMMARY: string;
  CORRECTIVE_SUMMARY: string;
  RECALL_NOTES: string;
  FAIL_SUMMARY: string;
  FAIL_DETAIL: string;
  recall_year: number;
  vehicle_age_at_recall: number;
  POTENTIAL_UNITS_AFFECTED_PRED: number;
}
