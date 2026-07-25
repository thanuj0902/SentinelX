export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatarColor: string;
}

export interface LoginEvent {
  id: string;
  userId: string;
  timestamp: string;
  ip: string;
  location: string;
  device: string;
  success: boolean;
}

export interface FileAccessEvent {
  id: string;
  userId: string;
  timestamp: string;
  fileName: string;
  fileType: string;
  action: 'read' | 'write' | 'download' | 'delete';
  fileSize: number;
}

export interface DataTransferEvent {
  id: string;
  userId: string;
  timestamp: string;
  volume: number;
  destination: string;
  protocol: string;
}

export type EventActivity = {
  hour: number;
  logins: number;
  fileAccesses: number;
  dataTransfers: number;
  totalDataVolume: number;
};

export type BaselineProfile = {
  userId: string;
  avgLoginsPerDay: number;
  stdLoginsPerDay: number;
  avgFileAccessPerDay: number;
  stdFileAccessPerDay: number;
  avgDataTransferPerDay: number;
  stdDataTransferPerDay: number;
  typicalHours: number[];
  hourlyActivity: number[];
};

export type AnomalyFactor = {
  name: string;
  score: number;
  description: string;
  weight: number;
};

export type Alert = {
  id: string;
  userId: string;
  timestamp: string;
  eventType: 'login' | 'file_access' | 'data_transfer';
  riskScore: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  factors: AnomalyFactor[];
  status: 'active' | 'confirmed_threat' | 'false_positive' | 'investigating';
  eventId: string;
};

export type ActionLogEntry = {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  level: 'info' | 'warning' | 'success';
};
