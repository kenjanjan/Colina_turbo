export interface SideBarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseHoverLeave: () => void;
  onCloseHoverEnter: () => void;
  isCloseHovered: boolean;
}

export interface PatientInfoProps {
  patient_admissionDate: string;
}

export interface RecentMedicationProps {
  [x: string]: any;
  medicationlogs_notes: string;
  medicationlogs_medicationLogStatus: string;
  medicationlogs_medicationLogsName: string;
  medicationlogs_medicationLogsDate: string;
  medicationlogs_medicationLogsTime: string;
}

export interface LatestVitalSignProps {
  vitalsign_bloodPressure: string;
  vitalsign_date: string;
  vitalsign_time: string;
  vitalsign_heartRate: string;
  vitalsign_respiratoryRate: string;
  vitalsign_temperature: string;
}

export interface LatestLabResultProps {
  lab_results_date: string;
  lab_results_fastingBloodGlucose: string;
  lab_results_hdlCholesterol: string;
  lab_results_hemoglobinA1c: string;
  lab_results_ldlCholesterol: string;
  lab_results_totalCholesterol: string;
  lab_results_triglycerides: string;
  lab_results_createdAt: string;
}

export interface LatestNotesProps {
  notes_createdAt: string;
  notes_notes?: string;
  notes_subject?: string;
}

export interface ActiveMedsProps {
  presriptions_name: string;
  prescriptions_dosage: string;
}

export interface LatestAdlsProps {
  adl_adls: string;
  adl_notes: string;
  adl_time: string;
  adl_date: string;
  adl_createdAt: string;
}

export interface PatientOverviewProps {
  isCollapsed: boolean;
  onOpenHoverEnter: () => void;
  onOpenHoverLeave: () => void;
  toggleSidebar: () => void;
  isOpenHovered: boolean;
}

export interface DBRecentMedicationProps {
  recentMedication: RecentMedicationProps;
  isMedicationCollapsed: boolean;
  isPRNCollapsed: boolean;
  toggleMedicationCollapse: () => void;
  patientId: string;
}

export interface DBRecentPRNProps {
  recentPRN: RecentMedicationProps;
  isMedicationCollapsed: boolean;
  isPRNCollapsed: boolean;
  togglePRNCollapse: () => void;
}
export interface SearchIconProps {
  className?: string;
  w?: number;
  h?: number;
}

export interface PatientDetailsProps {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  age: number;
  height: string;
  weight: string;
  mobility: string;
  dietaryRestrictions: string;
  dateOfBirth: string;
  phoneNo: string;
  address1: string;
  city: string;
  address2: string;
  state: string;
  country: string;
  zip: string;
  admissionDate: Date | string | undefined;
  codeStatus: string;
  email: string;
  admissionStatus: string;
  dischargeDate: Date | string | undefined;
  reAdmissionDate: Date | string | undefined;
  incidentReportDate: Date | string | undefined;
}

export interface EmergencyContactsProps {
  uuid: string;
  name: string;
  patientRelationship: string;
  phoneNumber: string;
  email: string;
}

interface Appointment {
  uuid?: string;
  // Add other properties if necessary
}

interface MedicationLog {
  uuid?: string;
  // Add other properties if necessary
}

export interface Notification {
  uuid: string;
  patientId: string;
  patientName: string;
  notificationType: string;
  date: string;
  time: string;
  userNotifications: any[];
  appointmentType: string;
  medicationName: string;
  medicationDosage: string;
  status: string;
  details: string;
  appointment?: Appointment;
  medicationLog?: MedicationLog;
}
export interface NotificationProps {
  isNotificationOpen: boolean;
  ref: React.RefObject<HTMLInputElement>;
  notifications: Notification[];
  setIsNotificationOpen: (value: boolean) => void;
  setIsNotificationClicked: any;
  isNotificationClicked: number;
}

export interface UserDetail {
  fName?: string;
  lName?: string;
  uuid?: string;
  email?: string;
}

export interface ModalProps {
  tab?: string;
  isModalOpen: (isOpen: boolean) => void;
  data: any;
  isView?: boolean;
  isOrder?: boolean;
  setIsOrder?: (isOpen: boolean) => void;
  setIsOrderModalOpen?: any;
  appointmentId?: string;
  onSuccess?: () => void;
  onFailed?: () => void;
  setErrorMessage?: any;
}
