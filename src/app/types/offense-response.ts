export interface OffenseResponse {
  id: string
  date: string
  time: string
  type: string
  location: string
  fine: number
  status: string
  description: string
  evidence: string
  dueDate: string
  severity: string
}

export enum OffenseSeverity {
  MAJOR = "MAJOR",
  MODERATE = "MODERATE",
  MINOR = "MINOR",
}

export enum OffenseStatus {
  UNPAID = "UNPAID",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAID = "PAID",
  UNDER_APPEAL = "UNDER_APPEAL",
  OVERDUE = "OVERDUE",
}

export enum OffenseType {
  SPEEDING = "Speeding",
  RED_LIGHT_VIOLATION = "Red Light Violation",
  ILLEGAL_PARKING = "Illegal Parking",
  LANE_VIOLATION = "Lane Violation",
}
