import type { User, LoginEvent, FileAccessEvent, DataTransferEvent, BaselineProfile, Alert, ActionLogEntry } from '../types';

const DEPARTMENTS = ['Engineering', 'Finance', 'Marketing', 'HR', 'Legal', 'Operations', 'Sales', 'R&D', 'IT', 'Executive'];
const ROLES = ['Engineer', 'Manager', 'Director', 'Analyst', 'VP', 'Specialist', 'Lead', 'Architect', 'Coordinator', 'Intern'];
const LOCATIONS = ['New York, US', 'San Francisco, US', 'London, UK', 'Berlin, DE', 'Bangalore, IN', 'Tokyo, JP', 'Remote', 'Singapore, SG', 'Toronto, CA', 'Sydney, AU'];
const DEVICES = ['Windows Desktop', 'MacBook Pro', 'Linux Workstation', 'iPhone', 'Android Phone', 'iPad'];
const FILE_TYPES = ['pdf', 'docx', 'xlsx', 'csv', 'zip', 'sql', 'json', 'py', 'js', 'env', 'pem', 'key', 'log', 'txt', 'png'];
const PROTOCOLS = ['HTTPS', 'FTP', 'SFTP', 'SSH', 'SCP', 'HTTP', 'SMTP'];
const DESTINATIONS = ['external-cloud', 'personal-drive', 'usb-device', 'email-attachment', 'unknown-server', 'cloud-sync', 'backup-service'];

const FIRST_NAMES = ['Aarav','Vivaan','Aditya','Arjun','Sai','Rohan','Vihaan','Krishna','Ishaan','Shaurya',
  'Diya','Ananya','Priya','Neha','Kavya','Aanya','Riya','Sara','Pari','Myra',
  'James','John','Robert','Michael','David','William','Richard','Joseph','Thomas','Charles',
  'Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen',
  'Wei','Yuki','Hans','Pierre','Carlos','Ahmed','Olga','Kim','Raj','Fatima',
  'Alex','Jordan','Sam','Casey','Morgan','Riley','Quinn','Avery','Dakota','Sage'];

const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
  'Patel','Kumar','Sharma','Singh','Gupta','Das','Mehta','Joshi','Reddy','Nair',
  'Wang','Zhang','Li','Chen','Liu','Kim','Park','Lee','Tanaka','Sato',
  'Muller','Schmidt','Fischer','Weber','Wagner','Schneider','Bauer','Koch','Richter','Wolf',
  'Martin','Bernard','Dubois','Moreau','Laurent','Simon','Michel','Lefevre','Leroy','Roux'];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function generateUsers(count: number): User[] {
  const rng = seededRandom(42);
  const users: User[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let name: string;
    do {
      name = `${pick(FIRST_NAMES, rng)} ${pick(LAST_NAMES, rng)}`;
    } while (usedNames.has(name));
    usedNames.add(name);

    const colors = ['#22d3ee', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
    users.push({
      id: `U${String(i + 1).padStart(3, '0')}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@sentinelx.io`,
      department: pick(DEPARTMENTS, rng),
      role: pick(ROLES, rng),
      avatarColor: pick(colors, rng),
    });
  }
  return users;
}

function generateLoginEvents(users: User[], rng: () => number): LoginEvent[] {
  const events: LoginEvent[] = [];
  const now = new Date();

  users.forEach(user => {
    const isHighActivity = rng() < 0.15;
    const isNightOwl = rng() < 0.1;
    const eventCount = isHighActivity ? Math.floor(rng() * 40 + 20) : Math.floor(rng() * 15 + 3);

    for (let i = 0; i < eventCount; i++) {
      const daysAgo = Math.floor(rng() * 30);
      let hour: number;
      if (isNightOwl) {
        hour = Math.floor(rng() * 6 + 22) % 24;
      } else if (isHighActivity) {
        hour = Math.floor(rng() * 14 + 7);
      } else {
        const weights = [0,0,0,0,0,0,0,1,2,3,3,3,2,3,3,3,2,1,1,0,0,0,0,0];
        const total = weights.reduce((a, b) => a + b, 0);
        let r = rng() * total;
        hour = 0;
        for (let h = 0; h < 24; h++) {
          r -= weights[h];
          if (r <= 0) { hour = h; break; }
        }
      }
      const minute = Math.floor(rng() * 60);
      const ts = new Date(now);
      ts.setDate(ts.getDate() - daysAgo);
      ts.setUTCHours(hour, minute, 0, 0);

      events.push({
        id: `L${events.length + 1}`,
        userId: user.id,
        timestamp: ts.toISOString(),
        ip: `${Math.floor(rng() * 200 + 10)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}`,
        location: rng() < 0.05 ? pick(LOCATIONS.filter(l => l !== 'Remote'), rng) : 'Remote',
        device: pick(DEVICES, rng),
        success: rng() < 0.97,
      });
    }
  });

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateFileAccessEvents(users: User[], rng: () => number): FileAccessEvent[] {
  const events: FileAccessEvent[] = [];
  const now = new Date();
  const actions: Array<'read' | 'write' | 'download' | 'delete'> = ['read', 'write', 'download', 'delete'];

  users.forEach(user => {
    const isDataHoarding = rng() < 0.08;
    const eventCount = isDataHoarding ? Math.floor(rng() * 80 + 40) : Math.floor(rng() * 30 + 5);

    for (let i = 0; i < eventCount; i++) {
      const daysAgo = Math.floor(rng() * 30);
      const hour = Math.floor(rng() * 14 + 7);
      const minute = Math.floor(rng() * 60);
      const ts = new Date(now);
      ts.setDate(ts.getDate() - daysAgo);
      ts.setUTCHours(hour, minute, 0, 0);

      const isSensitive = rng() < 0.12;
      const fileType = isSensitive ? pick(['env', 'pem', 'key', 'sql', 'csv'], rng) : pick(FILE_TYPES, rng);

      events.push({
        id: `F${events.length + 1}`,
        userId: user.id,
        timestamp: ts.toISOString(),
        fileName: `${pick(['report', 'data', 'config', 'backup', 'export', 'logs', 'metrics', 'audit'], rng)}_${Math.floor(rng() * 999)}.${fileType}`,
        fileType,
        action: isDataHoarding && rng() < 0.4 ? 'download' : pick(actions, rng),
        fileSize: isSensitive ? Math.floor(rng() * 5000000 + 500000) : Math.floor(rng() * 50000000 + 1000),
      });
    }
  });

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateDataTransferEvents(users: User[], rng: () => number): DataTransferEvent[] {
  const events: DataTransferEvent[] = [];
  const now = new Date();

  users.forEach(user => {
    const isExfiltrating = rng() < 0.05;
    const eventCount = isExfiltrating ? Math.floor(rng() * 15 + 8) : Math.floor(rng() * 6 + 1);

    for (let i = 0; i < eventCount; i++) {
      const daysAgo = Math.floor(rng() * 30);
      const hour = Math.floor(rng() * 24);
      const minute = Math.floor(rng() * 60);
      const ts = new Date(now);
      ts.setDate(ts.getDate() - daysAgo);
      ts.setUTCHours(hour, minute, 0, 0);

      const volume = isExfiltrating
        ? Math.floor(rng() * 5000000000 + 500000000)
        : Math.floor(rng() * 100000000 + 100000);

      events.push({
        id: `D${events.length + 1}`,
        userId: user.id,
        timestamp: ts.toISOString(),
        volume,
        destination: isExfiltrating && rng() < 0.6 ? 'external-cloud' : pick(DESTINATIONS, rng),
        protocol: pick(PROTOCOLS, rng),
      });
    }
  });

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function computeBaseline(
  userId: string,
  loginEvents: LoginEvent[],
  fileEvents: FileAccessEvent[],
  transferEvents: DataTransferEvent[],
  referenceTime?: number
): BaselineProfile {
  const now = referenceTime || Date.now();
  const dayBuckets = new Map<number, { logins: number; files: number; transfers: number; dataVolume: number }>();
  const hourlyActivity = new Array(24).fill(0);

  for (let d = 0; d < 30; d++) {
    dayBuckets.set(d, { logins: 0, files: 0, transfers: 0, dataVolume: 0 });
  }

  const userLogins = loginEvents.filter(e => e.userId === userId);
  const userFiles = fileEvents.filter(e => e.userId === userId);
  const userTransfers = transferEvents.filter(e => e.userId === userId);

  userLogins.forEach(e => {
    const d = Math.floor((now - new Date(e.timestamp).getTime()) / 86400000);
    if (d >= 0 && d < 30) {
      const bucket = dayBuckets.get(d)!;
      bucket.logins++;
      hourlyActivity[new Date(e.timestamp).getUTCHours()]++;
    }
  });

  userFiles.forEach(e => {
    const d = Math.floor((now - new Date(e.timestamp).getTime()) / 86400000);
    if (d >= 0 && d < 30) {
      const bucket = dayBuckets.get(d)!;
      bucket.files++;
      hourlyActivity[new Date(e.timestamp).getUTCHours()]++;
    }
  });

  userTransfers.forEach(e => {
    const d = Math.floor((now - new Date(e.timestamp).getTime()) / 86400000);
    if (d >= 0 && d < 30) {
      const bucket = dayBuckets.get(d)!;
      bucket.transfers++;
      bucket.dataVolume += e.volume;
      hourlyActivity[new Date(e.timestamp).getUTCHours()]++;
    }
  });

  const vals = Array.from(dayBuckets.values());
  const mean = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const std = (arr: number[]) => {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length) || 1;
  };

  const loginCounts = vals.map(v => v.logins);
  const fileCounts = vals.map(v => v.files);
  const transferCounts = vals.map(v => v.transfers);

  const totalHourly = hourlyActivity.reduce((a, b) => a + b, 0) || 1;

  return {
    userId,
    avgLoginsPerDay: mean(loginCounts),
    stdLoginsPerDay: std(loginCounts),
    avgFileAccessPerDay: mean(fileCounts),
    stdFileAccessPerDay: std(fileCounts),
    avgDataTransferPerDay: mean(transferCounts),
    stdDataTransferPerDay: std(transferCounts),
    typicalHours: hourlyActivity.map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(h => h.hour),
    hourlyActivity: hourlyActivity.map(c => c / totalHourly),
  };
}

function computeZScore(value: number, mean: number, std: number): number {
  if (std === 0) return 0;
  return (value - mean) / std;
}

function computeRiskScore(
  loginZScore: number,
  fileZScore: number,
  transferZScore: number,
  hourDeviation: number,
  sensitivity: number
): number {
  const weighted = (
    Math.abs(loginZScore) * 20 +
    Math.abs(fileZScore) * 30 +
    Math.abs(transferZScore) * 35 +
    hourDeviation * 15
  );
  const scaled = Math.min(100, (weighted * sensitivity) / 3);
  return Math.round(Math.max(0, Math.min(100, scaled)));
}

function getSeverity(score: number): Alert['severity'] {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

function generateExplanation(
  eventType: string,
  loginZ: number,
  fileZ: number,
  transferZ: number,
  hourDev: number,
  _baseline: BaselineProfile
): string {
  const parts: string[] = [];

  if (eventType === 'login' && Math.abs(loginZ) > 1) {
    const direction = loginZ > 0 ? 'above' : 'below';
    const multiplier = Math.abs(loginZ).toFixed(1);
    parts.push(`Login frequency ${multiplier}x ${direction} 30-day baseline`);
  }
  if (eventType === 'file_access' && Math.abs(fileZ) > 1) {
    const multiplier = Math.abs(fileZ).toFixed(1);
    parts.push(`File access volume ${multiplier}x above 30-day baseline`);
  }
  if (eventType === 'data_transfer' && Math.abs(transferZ) > 1) {
    const multiplier = Math.abs(transferZ).toFixed(1);
    parts.push(`Data transfer volume ${multiplier}x above 30-day baseline`);
  }
  if (hourDev > 0.5) {
    parts.push('Activity during atypical hours');
  }

  if (parts.length === 0) {
    if (eventType === 'login') parts.push('Unusual login pattern detected');
    else if (eventType === 'file_access') parts.push('Abnormal file access behavior');
    else parts.push('Unusual data transfer detected');
  }

  return parts.join('; ');
}

function generateAlerts(
  users: User[],
  baselines: Map<string, BaselineProfile>,
  loginEvents: LoginEvent[],
  fileEvents: FileAccessEvent[],
  transferEvents: DataTransferEvent[],
  sensitivity: number
): Alert[] {
  const alerts: Alert[] = [];
  let alertId = 1;
  const now = Date.now();

  const recentLogins = loginEvents.filter(e => {
    const d = (now - new Date(e.timestamp).getTime()) / 86400000;
    return d < 2;
  });

  const recentFiles = fileEvents.filter(e => {
    const d = (now - new Date(e.timestamp).getTime()) / 86400000;
    return d < 2;
  });

  const recentTransfers = transferEvents.filter(e => {
    const d = (now - new Date(e.timestamp).getTime()) / 86400000;
    return d < 2;
  });

  const userRecentLogins = new Map<string, LoginEvent[]>();
  recentLogins.forEach(e => {
    if (!userRecentLogins.has(e.userId)) userRecentLogins.set(e.userId, []);
    userRecentLogins.get(e.userId)!.push(e);
  });

  const userRecentFiles = new Map<string, FileAccessEvent[]>();
  recentFiles.forEach(e => {
    if (!userRecentFiles.has(e.userId)) userRecentFiles.set(e.userId, []);
    userRecentFiles.get(e.userId)!.push(e);
  });

  const userRecentTransfers = new Map<string, DataTransferEvent[]>();
  recentTransfers.forEach(e => {
    if (!userRecentTransfers.has(e.userId)) userRecentTransfers.set(e.userId, []);
    userRecentTransfers.get(e.userId)!.push(e);
  });

  users.forEach(user => {
    const baseline = baselines.get(user.id);
    if (!baseline) return;

    const uLogins = userRecentLogins.get(user.id) || [];
    const uFiles = userRecentFiles.get(user.id) || [];
    const uTransfers = userRecentTransfers.get(user.id) || [];

    const loginZ = computeZScore(uLogins.length, baseline.avgLoginsPerDay, baseline.stdLoginsPerDay);
    const fileZ = computeZScore(uFiles.length, baseline.avgFileAccessPerDay, baseline.stdFileAccessPerDay);
    const transferZ = computeZScore(uTransfers.length, baseline.avgDataTransferPerDay, baseline.stdDataTransferPerDay);

    const atypicalHours = uLogins.filter(e => !baseline.typicalHours.includes(new Date(e.timestamp).getUTCHours()));
    const hourDev = atypicalHours.length / Math.max(uLogins.length, 1);

    const factors = [
      { name: 'Login Pattern', score: Math.round(Math.abs(loginZ) * 20), description: `Z-score: ${loginZ.toFixed(2)}`, weight: 20 },
      { name: 'File Access Volume', score: Math.round(Math.abs(fileZ) * 30), description: `Z-score: ${fileZ.toFixed(2)}`, weight: 30 },
      { name: 'Data Transfer Volume', score: Math.round(Math.abs(transferZ) * 35), description: `Z-score: ${transferZ.toFixed(2)}`, weight: 35 },
      { name: 'Time-of-Access', score: Math.round(hourDev * 15), description: `${Math.round(hourDev * 100)}% atypical hour activity`, weight: 15 },
    ];

    if (uLogins.length > 0) {
      const loginScore = computeRiskScore(loginZ, 0, 0, hourDev, sensitivity);
      if (loginScore > 20) {
        const event = uLogins[0];
        alerts.push({
          id: `A${String(alertId++).padStart(4, '0')}`,
          userId: user.id,
          timestamp: event.timestamp,
          eventType: 'login',
          riskScore: loginScore,
          severity: getSeverity(loginScore),
          explanation: generateExplanation('login', loginZ, 0, 0, hourDev, baseline),
          factors: factors.filter(f => f.name === 'Login Pattern' || f.name === 'Time-of-Access'),
          status: loginScore > 60 ? 'investigating' : 'active',
          eventId: event.id,
          eventData: { ...event },
        });
      }
    }

    if (uFiles.length > 0) {
      const fileScore = computeRiskScore(0, fileZ, 0, hourDev, sensitivity);
      if (fileScore > 20) {
        const event = uFiles[0];
        alerts.push({
          id: `A${String(alertId++).padStart(4, '0')}`,
          userId: user.id,
          timestamp: event.timestamp,
          eventType: 'file_access',
          riskScore: fileScore,
          severity: getSeverity(fileScore),
          explanation: generateExplanation('file_access', 0, fileZ, 0, hourDev, baseline),
          factors: factors.filter(f => f.name === 'File Access Volume' || f.name === 'Time-of-Access'),
          status: fileScore > 60 ? 'investigating' : 'active',
          eventId: event.id,
          eventData: { ...event },
        });
      }
    }

    if (uTransfers.length > 0) {
      const transferScore = computeRiskScore(0, 0, transferZ, hourDev, sensitivity);
      if (transferScore > 20) {
        const event = uTransfers[0];
        alerts.push({
          id: `A${String(alertId++).padStart(4, '0')}`,
          userId: user.id,
          timestamp: event.timestamp,
          eventType: 'data_transfer',
          riskScore: transferScore,
          severity: getSeverity(transferScore),
          explanation: generateExplanation('data_transfer', 0, 0, transferZ, hourDev, baseline),
          factors: factors.filter(f => f.name === 'Data Transfer Volume' || f.name === 'Time-of-Access'),
          status: transferScore > 60 ? 'investigating' : 'active',
          eventId: event.id,
          eventData: { ...event },
        });
      }
    }
  });

  return alerts.sort((a, b) => b.riskScore - a.riskScore);
}

function generateActionLog(userCount: number): ActionLogEntry[] {
  const now = new Date();
  return [
    { id: 'AL001', timestamp: new Date(now.getTime() - 3600000 * 2).toISOString(), action: 'Baseline Recalculated', details: `Baseline profiles updated for ${userCount} users across 10 departments`, level: 'info' },
    { id: 'AL002', timestamp: new Date(now.getTime() - 3600000 * 1.5).toISOString(), action: 'Anomaly Scan Complete', details: `Scanned recent events in the 48h window. Anomalies detected.`, level: 'info' },
    { id: 'AL003', timestamp: new Date(now.getTime() - 3600000 * 1).toISOString(), action: 'Alert Escalated', details: 'High-risk alert escalated — 3 correlated anomalies detected', level: 'warning' },
    { id: 'AL004', timestamp: new Date(now.getTime() - 3600000 * 0.5).toISOString(), action: 'Sensitivity Updated', details: 'Detection sensitivity adjusted — re-scoring active alerts', level: 'info' },
    { id: 'AL005', timestamp: new Date(now.getTime() - 3600000 * 0.25).toISOString(), action: 'Feedback Processed', details: 'False positives marked — baselines recalibrated for affected users', level: 'success' },
    { id: 'AL006', timestamp: new Date(now.getTime() - 3600000 * 0.1).toISOString(), action: 'New Events Ingested', details: 'Batch ingested new log events from simulated SIEM connector', level: 'info' },
  ];
}

// Cache: events + baselines (sensitivity-independent)
let _eventCache: EventCache | null = null;

// Mutable state
let _alerts: Alert[] | null = null;
let _actionLog: ActionLogEntry[] | null = null;
let _feedbackUsers: Set<string> = new Set();

type EventCache = {
  users: User[];
  logins: LoginEvent[];
  files: FileAccessEvent[];
  transfers: DataTransferEvent[];
  baselines: Map<string, BaselineProfile>;
};

function buildEventCache(): EventCache {
  if (_eventCache) return _eventCache;

  const users = generateUsers(200);
  const rng = seededRandom(42);
  const logins = generateLoginEvents(users, rng);
  const files = generateFileAccessEvents(users, rng);
  const transfers = generateDataTransferEvents(users, rng);

  const baselines = new Map<string, BaselineProfile>();
  users.forEach(user => {
    baselines.set(user.id, computeBaseline(user.id, logins, files, transfers));
  });

  const cache: EventCache = { users, logins, files, transfers, baselines };
  _eventCache = cache;
  return cache;
}

export interface SentinelXData {
  users: User[];
  baselines: Map<string, BaselineProfile>;
  alerts: Alert[];
  actionLog: ActionLogEntry[];
  totalDepartments: number;
}

export function getData(sensitivity: number = 1.0): SentinelXData {
  const cache = buildEventCache();

  if (!_alerts) {
    _alerts = generateAlerts(cache.users, cache.baselines, cache.logins, cache.files, cache.transfers, sensitivity);
  }

  if (!_actionLog) {
    _actionLog = generateActionLog(cache.users.length);
  }

  return {
    users: cache.users,
    baselines: cache.baselines,
    alerts: _alerts,
    actionLog: _actionLog,
    totalDepartments: DEPARTMENTS.length,
  };
}

export function regenerateData(sensitivity: number): SentinelXData {
  _alerts = null;
  return getData(sensitivity);
}

export function applyFeedback(
  alertId: string,
  status: 'confirmed_threat' | 'false_positive'
): { alerts: Alert[]; actionLog: ActionLogEntry[]; affectedUsers: number } {
  if (!_alerts) getData(1.0);
  if (!_alerts) return { alerts: [], actionLog: [], affectedUsers: 0 };

  const alert = _alerts.find(a => a.id === alertId);
  if (!alert) return { alerts: _alerts, actionLog: _actionLog || [], affectedUsers: 0 };

  _alerts = _alerts.map(a => a.id === alertId ? { ...a, status } : a);

  _feedbackUsers.add(alert.userId);

  if (status === 'false_positive') {
    const cache = buildEventCache();
    const updatedBaseline = computeBaseline(
      alert.userId,
      cache.logins,
      cache.files,
      cache.transfers
    );
    cache.baselines.set(alert.userId, updatedBaseline);
  }

  const now = new Date();
  const entry: ActionLogEntry = {
    id: `AL${String((_actionLog?.length || 0) + 1).padStart(3, '0')}`,
    timestamp: now.toISOString(),
    action: status === 'false_positive' ? 'False Positive Marked' : 'Threat Confirmed',
    details: status === 'false_positive'
      ? `Alert ${alertId} marked as false positive — baseline recalibrated for user ${alert.userId}`
      : `Alert ${alertId} confirmed as threat — user ${alert.userId} flagged for investigation`,
    level: status === 'false_positive' ? 'success' : 'warning',
  };

  _actionLog = [entry, ...(_actionLog || [])];

  return {
    alerts: _alerts,
    actionLog: _actionLog,
    affectedUsers: _feedbackUsers.size,
  };
}
