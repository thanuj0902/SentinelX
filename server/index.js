import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

const db = new Database(path.join(__dirname, 'sentinelx.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    department TEXT,
    role TEXT,
    avatarColor TEXT
  );
  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    userId TEXT,
    timestamp TEXT,
    eventType TEXT,
    riskScore INTEGER,
    severity TEXT,
    explanation TEXT,
    factors TEXT,
    status TEXT DEFAULT 'active',
    eventId TEXT,
    eventData TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS baselines (
    userId TEXT PRIMARY KEY,
    avgLoginsPerDay REAL,
    stdLoginsPerDay REAL,
    avgFileAccessPerDay REAL,
    stdFileAccessPerDay REAL,
    avgDataTransferPerDay REAL,
    stdDataTransferPerDay REAL,
    typicalHours TEXT,
    hourlyActivity TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS action_log (
    id TEXT PRIMARY KEY,
    timestamp TEXT,
    action TEXT,
    details TEXT,
    level TEXT
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

function seedDatabase() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return;

  console.log('Seeding database with synthetic data...');

  const DEPARTMENTS = ['Engineering', 'Finance', 'Marketing', 'HR', 'Legal', 'Operations', 'Sales', 'R&D', 'IT', 'Executive'];
  const ROLES = ['Engineer', 'Manager', 'Director', 'Analyst', 'VP', 'Specialist', 'Lead', 'Architect', 'Coordinator', 'Intern'];
  const LOCATIONS = ['New York, US', 'San Francisco, US', 'London, UK', 'Berlin, DE', 'Bangalore, IN', 'Tokyo, JP', 'Remote', 'Singapore, SG', 'Toronto, CA', 'Sydney, AU'];
  const DEVICES = ['Windows Desktop', 'MacBook Pro', 'Linux Workstation', 'iPhone', 'Android Phone', 'iPad'];
  const FILE_TYPES = ['pdf', 'docx', 'xlsx', 'csv', 'zip', 'sql', 'json', 'py', 'js', 'env', 'pem', 'key', 'log', 'txt', 'png'];
  const PROTOCOLS = ['HTTPS', 'FTP', 'SFTP', 'SSH', 'SCP', 'HTTP', 'SMTP'];
  const DESTINATIONS = ['external-cloud', 'personal-drive', 'usb-device', 'email-attachment', 'unknown-server', 'cloud-sync', 'backup-service'];
  const FIRST_NAMES = ['Aarav','Vivaan','Aditya','Arjun','Sai','Rohan','Vihaan','Krishna','Ishaan','Shaurya','Diya','Ananya','Priya','Neha','Kavya','Aanya','Riya','Sara','Pari','Myra','James','John','Robert','Michael','David','William','Richard','Joseph','Thomas','Charles','Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen','Wei','Yuki','Hans','Pierre','Carlos','Ahmed','Olga','Kim','Raj','Fatima','Alex','Jordan','Sam','Casey','Morgan','Riley','Quinn','Avery','Dakota','Sage'];
  const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Patel','Kumar','Sharma','Singh','Gupta','Das','Mehta','Joshi','Reddy','Nair','Wang','Zhang','Li','Chen','Liu','Kim','Park','Lee','Tanaka','Sato','Muller','Schmidt','Fischer','Weber','Wagner','Schneider','Bauer','Koch','Richter','Wolf','Martin','Bernard','Dubois','Moreau','Laurent','Simon','Michel','Lefevre','Leroy','Roux'];
  const COLORS = ['#22d3ee', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  let s = 42;
  const rng = () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  const insertUser = db.prepare('INSERT INTO users (id, name, email, department, role, avatarColor) VALUES (?, ?, ?, ?, ?, ?)');
  const insertLogin = db.prepare('INSERT INTO alerts (id, userId, timestamp, eventType, riskScore, severity, explanation, factors, status, eventId, eventData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertBaseline = db.prepare('INSERT INTO baselines (userId, avgLoginsPerDay, stdLoginsPerDay, avgFileAccessPerDay, stdFileAccessPerDay, avgDataTransferPerDay, stdDataTransferPerDay, typicalHours, hourlyActivity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertLog = db.prepare('INSERT INTO action_log (id, timestamp, action, details, level) VALUES (?, ?, ?, ?, ?)');

  const users = [];
  const usedNames = new Set();
  for (let i = 0; i < 200; i++) {
    let name;
    do { name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`; } while (usedNames.has(name));
    usedNames.add(name);
    const id = `U${String(i + 1).padStart(3, '0')}`;
    const user = { id, name, email: `${name.toLowerCase().replace(' ', '.')}@sentinelx.io`, department: pick(DEPARTMENTS), role: pick(ROLES), avatarColor: pick(COLORS) };
    users.push(user);
    insertUser.run(user.id, user.name, user.email, user.department, user.role, user.avatarColor);
  }

  const now = Date.now();
  const loginEvents = [];
  const fileEvents = [];
  const transferEvents = [];

  users.forEach(user => {
    const isHigh = rng() < 0.15;
    const isNight = rng() < 0.1;
    const loginCount = isHigh ? Math.floor(rng() * 40 + 20) : Math.floor(rng() * 15 + 3);
    for (let i = 0; i < loginCount; i++) {
      const daysAgo = Math.floor(rng() * 30);
      let hour = isNight ? Math.floor(rng() * 6 + 22) % 24 : isHigh ? Math.floor(rng() * 14 + 7) : (() => {
        const w = [0,0,0,0,0,0,0,1,2,3,3,3,2,3,3,3,2,1,1,0,0,0,0,0];
        const t = w.reduce((a, b) => a + b, 0);
        let r = rng() * t, h = 0;
        for (let j = 0; j < 24; j++) { r -= w[j]; if (r <= 0) { h = j; break; } }
        return h;
      })();
      const ts = new Date(now);
      ts.setDate(ts.getDate() - daysAgo);
      ts.setUTCHours(hour, Math.floor(rng() * 60), 0, 0);
      const ip = `${Math.floor(rng() * 200 + 10)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}`;
      loginEvents.push({ id: `L${loginEvents.length + 1}`, userId: user.id, timestamp: ts.toISOString(), ip, location: rng() < 0.05 ? pick(LOCATIONS.filter(l => l !== 'Remote')) : 'Remote', device: pick(DEVICES), success: rng() < 0.97 });
    }

    const isHoarding = rng() < 0.08;
    const fileCount = isHoarding ? Math.floor(rng() * 80 + 40) : Math.floor(rng() * 30 + 5);
    for (let i = 0; i < fileCount; i++) {
      const daysAgo = Math.floor(rng() * 30);
      const ts = new Date(now);
      ts.setDate(ts.getDate() - daysAgo);
      ts.setUTCHours(Math.floor(rng() * 14 + 7), Math.floor(rng() * 60), 0, 0);
      const isSens = rng() < 0.12;
      const ft = isSens ? pick(['env', 'pem', 'key', 'sql', 'csv']) : pick(FILE_TYPES);
      const actions = ['read', 'write', 'download', 'delete'];
      fileEvents.push({ id: `F${fileEvents.length + 1}`, userId: user.id, timestamp: ts.toISOString(), fileName: `${pick(['report', 'data', 'config', 'backup', 'export', 'logs', 'metrics', 'audit'])}_${Math.floor(rng() * 999)}.${ft}`, fileType: ft, action: isHoarding && rng() < 0.4 ? 'download' : pick(actions), fileSize: isSens ? Math.floor(rng() * 5000000 + 500000) : Math.floor(rng() * 50000000 + 1000) });
    }

    const isExfil = rng() < 0.05;
    const tCount = isExfil ? Math.floor(rng() * 15 + 8) : Math.floor(rng() * 6 + 1);
    for (let i = 0; i < tCount; i++) {
      const daysAgo = Math.floor(rng() * 30);
      const ts = new Date(now);
      ts.setDate(ts.getDate() - daysAgo);
      ts.setUTCHours(Math.floor(rng() * 24), Math.floor(rng() * 60), 0, 0);
      const vol = isExfil ? Math.floor(rng() * 5000000000 + 500000000) : Math.floor(rng() * 100000000 + 100000);
      transferEvents.push({ id: `D${transferEvents.length + 1}`, userId: user.id, timestamp: ts.toISOString(), volume: vol, destination: isExfil && rng() < 0.6 ? 'external-cloud' : pick(DESTINATIONS), protocol: pick(PROTOCOLS) });
    }
  });

  const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  const std = (arr) => { const m = mean(arr); return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length) || 1; };

  users.forEach(user => {
    const uLogins = loginEvents.filter(e => e.userId === user.id);
    const uFiles = fileEvents.filter(e => e.userId === user.id);
    const uTransfers = transferEvents.filter(e => e.userId === user.id);

    const dayBuckets = Array.from({ length: 30 }, () => ({ logins: 0, files: 0, transfers: 0 }));
    const hourly = new Array(24).fill(0);

    uLogins.forEach(e => {
      const d = Math.floor((now - new Date(e.timestamp).getTime()) / 86400000);
      if (d >= 0 && d < 30) { dayBuckets[d].logins++; hourly[new Date(e.timestamp).getUTCHours()]++; }
    });
    uFiles.forEach(e => {
      const d = Math.floor((now - new Date(e.timestamp).getTime()) / 86400000);
      if (d >= 0 && d < 30) { dayBuckets[d].files++; hourly[new Date(e.timestamp).getUTCHours()]++; }
    });
    uTransfers.forEach(e => {
      const d = Math.floor((now - new Date(e.timestamp).getTime()) / 86400000);
      if (d >= 0 && d < 30) { dayBuckets[d].transfers++; hourly[new Date(e.timestamp).getUTCHours()]++; }
    });

    const loginCounts = dayBuckets.map(b => b.logins);
    const fileCounts = dayBuckets.map(b => b.files);
    const transferCounts = dayBuckets.map(b => b.transfers);
    const totalH = hourly.reduce((a, b) => a + b, 0) || 1;
    const typicalHours = hourly.map((c, h) => ({ h, c })).sort((a, b) => b.c - a.c).slice(0, 5).map(x => x.h);

    insertBaseline.run(user.id, mean(loginCounts), std(loginCounts), mean(fileCounts), std(fileCounts), mean(transferCounts), std(transferCounts), JSON.stringify(typicalHours), JSON.stringify(hourly.map(c => c / totalH)));
  });

  const sensitivity = 1.0;
  let alertId = 1;
  const recentLogins = loginEvents.filter(e => (now - new Date(e.timestamp).getTime()) / 86400000 < 2);
  const recentFiles = fileEvents.filter(e => (now - new Date(e.timestamp).getTime()) / 86400000 < 2);
  const recentTransfers = transferEvents.filter(e => (now - new Date(e.timestamp).getTime()) / 86400000 < 2);

  const userRecentLogins = new Map();
  recentLogins.forEach(e => { if (!userRecentLogins.has(e.userId)) userRecentLogins.set(e.userId, []); userRecentLogins.get(e.userId).push(e); });
  const userRecentFiles = new Map();
  recentFiles.forEach(e => { if (!userRecentFiles.has(e.userId)) userRecentFiles.set(e.userId, []); userRecentFiles.get(e.userId).push(e); });
  const userRecentTransfers = new Map();
  recentTransfers.forEach(e => { if (!userRecentTransfers.has(e.userId)) userRecentTransfers.set(e.userId, []); userRecentTransfers.get(e.userId).push(e); });

  users.forEach(user => {
    const bl = db.prepare('SELECT * FROM baselines WHERE userId = ?').get(user.id);
    if (!bl) return;
    const typicalHours = JSON.parse(bl.typicalHours);
    const uL = userRecentLogins.get(user.id) || [];
    const uF = userRecentFiles.get(user.id) || [];
    const uT = userRecentTransfers.get(user.id) || [];

    const loginZ = bl.stdLoginsPerDay === 0 ? 0 : (uL.length - bl.avgLoginsPerDay) / bl.stdLoginsPerDay;
    const fileZ = bl.stdFileAccessPerDay === 0 ? 0 : (uF.length - bl.avgFileAccessPerDay) / bl.stdFileAccessPerDay;
    const transferZ = bl.stdDataTransferPerDay === 0 ? 0 : (uT.length - bl.avgDataTransferPerDay) / bl.stdDataTransferPerDay;
    const atypicalHours = uL.filter(e => !typicalHours.includes(new Date(e.timestamp).getUTCHours()));
    const hourDev = atypicalHours.length / Math.max(uL.length, 1);

    const factors = [
      { name: 'Login Pattern', score: Math.round(Math.abs(loginZ) * 20), description: `Z-score: ${loginZ.toFixed(2)}`, weight: 20 },
      { name: 'File Access Volume', score: Math.round(Math.abs(fileZ) * 30), description: `Z-score: ${fileZ.toFixed(2)}`, weight: 30 },
      { name: 'Data Transfer Volume', score: Math.round(Math.abs(transferZ) * 35), description: `Z-score: ${transferZ.toFixed(2)}`, weight: 35 },
      { name: 'Time-of-Access', score: Math.round(hourDev * 15), description: `${Math.round(hourDev * 100)}% atypical hour activity`, weight: 15 },
    ];

    const genExplanation = (type) => {
      const parts = [];
      if (type === 'login' && Math.abs(loginZ) > 1) parts.push(`Login frequency ${Math.abs(loginZ).toFixed(1)}x ${loginZ > 0 ? 'above' : 'below'} 30-day baseline`);
      if (type === 'file_access' && Math.abs(fileZ) > 1) parts.push(`File access volume ${Math.abs(fileZ).toFixed(1)}x above 30-day baseline`);
      if (type === 'data_transfer' && Math.abs(transferZ) > 1) parts.push(`Data transfer volume ${Math.abs(transferZ).toFixed(1)}x above 30-day baseline`);
      if (hourDev > 0.5) parts.push('Activity during atypical hours');
      if (parts.length === 0) parts.push(type === 'login' ? 'Unusual login pattern detected' : type === 'file_access' ? 'Abnormal file access behavior' : 'Unusual data transfer detected');
      return parts.join('; ');
    };

    const getSeverity = (s) => s >= 80 ? 'critical' : s >= 60 ? 'high' : s >= 35 ? 'medium' : 'low';
    const computeRisk = (lZ, fZ, tZ, hD) => Math.min(100, (Math.abs(lZ) * 20 + Math.abs(fZ) * 30 + Math.abs(tZ) * 35 + hD * 15) * sensitivity / 3);

    if (uL.length > 0) {
      const score = Math.round(Math.max(0, Math.min(100, computeRisk(loginZ, 0, 0, hourDev))));
      if (score > 20) {
        const ev = uL[0];
        insertLogin.run(`A${String(alertId++).padStart(4, '0')}`, user.id, ev.timestamp, 'login', score, getSeverity(score), genExplanation('login'), JSON.stringify(factors.filter(f => f.name === 'Login Pattern' || f.name === 'Time-of-Access')), score > 60 ? 'investigating' : 'active', ev.id, JSON.stringify(ev));
      }
    }
    if (uF.length > 0) {
      const score = Math.round(Math.max(0, Math.min(100, computeRisk(0, fileZ, 0, hourDev))));
      if (score > 20) {
        const ev = uF[0];
        insertLogin.run(`A${String(alertId++).padStart(4, '0')}`, user.id, ev.timestamp, 'file_access', score, getSeverity(score), genExplanation('file_access'), JSON.stringify(factors.filter(f => f.name === 'File Access Volume' || f.name === 'Time-of-Access')), score > 60 ? 'investigating' : 'active', ev.id, JSON.stringify(ev));
      }
    }
    if (uT.length > 0) {
      const score = Math.round(Math.max(0, Math.min(100, computeRisk(0, 0, transferZ, hourDev))));
      if (score > 20) {
        const ev = uT[0];
        insertLogin.run(`A${String(alertId++).padStart(4, '0')}`, user.id, ev.timestamp, 'data_transfer', score, getSeverity(score), genExplanation('data_transfer'), JSON.stringify(factors.filter(f => f.name === 'Data Transfer Volume' || f.name === 'Time-of-Access')), score > 60 ? 'investigating' : 'active', ev.id, JSON.stringify(ev));
      }
    }
  });

  const logEntries = [
    { id: 'AL001', action: 'Baseline Recalculated', details: `Baseline profiles updated for ${users.length} users across ${DEPARTMENTS.length} departments`, level: 'info' },
    { id: 'AL002', action: 'Anomaly Scan Complete', details: 'Scanned recent events in the 48h window. Anomalies detected.', level: 'info' },
    { id: 'AL003', action: 'Alert Escalated', details: 'High-risk alert escalated — correlated anomalies detected', level: 'warning' },
    { id: 'AL004', action: 'Sensitivity Updated', details: 'Detection sensitivity adjusted — re-scoring active alerts', level: 'info' },
    { id: 'AL005', action: 'Feedback Processed', details: 'False positives marked — baselines recalibrated for affected users', level: 'success' },
    { id: 'AL006', action: 'New Events Ingested', details: 'Batch ingested new log events from simulated SIEM connector', level: 'info' },
  ];
  logEntries.forEach((e, i) => {
    insertLog.run(e.id, new Date(now - 3600000 * (6 - i * 0.5)).toISOString(), e.action, e.details, e.level);
  });

  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('sensitivity', '1.0');
  console.log(`Seeded ${users.length} users, ${loginEvents.length} logins, ${fileEvents.length} files, ${transferEvents.length} transfers`);
}

seedDatabase();

// --- API Routes ---

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  const totalDepartments = db.prepare('SELECT COUNT(DISTINCT department) as count FROM users').get().count;
  res.json({ users, totalDepartments });
});

app.get('/api/baselines', (req, res) => {
  const rows = db.prepare('SELECT * FROM baselines').all();
  const baselines = new Map(rows.map(r => [r.userId, {
    userId: r.userId,
    avgLoginsPerDay: r.avgLoginsPerDay,
    stdLoginsPerDay: r.stdLoginsPerDay,
    avgFileAccessPerDay: r.avgFileAccessPerDay,
    stdFileAccessPerDay: r.stdFileAccessPerDay,
    avgDataTransferPerDay: r.avgDataTransferPerDay,
    stdDataTransferPerDay: r.stdDataTransferPerDay,
    typicalHours: JSON.parse(r.typicalHours),
    hourlyActivity: JSON.parse(r.hourlyActivity),
  }]));
  res.json({ baselines: Object.fromEntries(baselines) });
});

app.get('/api/alerts', (req, res) => {
  const rows = db.prepare('SELECT * FROM alerts ORDER BY riskScore DESC').all();
  const alerts = rows.map(r => ({
    ...r,
    factors: JSON.parse(r.factors),
    eventData: r.eventData ? JSON.parse(r.eventData) : undefined,
  }));
  res.json({ alerts });
});

app.get('/api/action-log', (req, res) => {
  const entries = db.prepare('SELECT * FROM action_log ORDER BY timestamp DESC').all();
  res.json({ entries });
});

app.get('/api/sensitivity', (req, res) => {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('sensitivity');
  res.json({ sensitivity: parseFloat(row?.value || '1.0') });
});

app.post('/api/sensitivity', (req, res) => {
  const { sensitivity } = req.body;
  db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(String(sensitivity), 'sensitivity');

  const entry = {
    id: `AL${String(Date.now()).slice(-6)}`,
    timestamp: new Date().toISOString(),
    action: 'Sensitivity Updated',
    details: `Detection sensitivity adjusted to ${parseFloat(sensitivity).toFixed(1)}x`,
    level: 'info',
  };
  db.prepare('INSERT INTO action_log (id, timestamp, action, details, level) VALUES (?, ?, ?, ?, ?)').run(entry.id, entry.timestamp, entry.action, entry.details, entry.level);

  broadcast({ type: 'sensitivity', sensitivity: parseFloat(sensitivity) });
  res.json({ ok: true });
});

app.post('/api/alerts/:id/mark', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['confirmed_threat', 'false_positive'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const alert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  db.prepare('UPDATE alerts SET status = ? WHERE id = ?').run(status, id);

  const entry = {
    id: `AL${String(Date.now()).slice(-6)}`,
    timestamp: new Date().toISOString(),
    action: status === 'false_positive' ? 'False Positive Marked' : 'Threat Confirmed',
    details: status === 'false_positive'
      ? `Alert ${id} marked as false positive — baseline recalibrated for user ${alert.userId}`
      : `Alert ${id} confirmed as threat — user ${alert.userId} flagged for investigation`,
    level: status === 'false_positive' ? 'success' : 'warning',
  };
  db.prepare('INSERT INTO action_log (id, timestamp, action, details, level) VALUES (?, ?, ?, ?, ?)').run(entry.id, entry.timestamp, entry.action, entry.details, entry.level);

  const updatedAlert = db.prepare('SELECT * FROM alerts WHERE id = ?').get(id);
  broadcast({ type: 'alert_update', alert: { ...updatedAlert, factors: JSON.parse(updatedAlert.factors), eventData: updatedAlert.eventData ? JSON.parse(updatedAlert.eventData) : undefined } });

  res.json({ ok: true });
});

app.get('/api/stats', (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const activeAlerts = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE status IN ('active', 'investigating')").get().count;
  const confirmedThreats = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE status = 'confirmed_threat'").get().count;
  const falsePositives = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE status = 'false_positive'").get().count;
  const totalResolved = confirmedThreats + falsePositives;
  const fpRate = totalResolved > 0 ? Math.round((falsePositives / totalResolved) * 100) : 0;
  const criticalCount = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'critical' AND status IN ('active', 'investigating')").get().count;
  const highCount = db.prepare("SELECT COUNT(*) as count FROM alerts WHERE severity = 'high' AND status IN ('active', 'investigating')").get().count;

  res.json({ totalUsers, activeAlerts, confirmedThreats, falsePositives, fpRate, criticalCount, highCount });
});

// WebSocket
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'connected', message: 'SentinelX WebSocket connected' }));
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`SentinelX API running on http://localhost:${PORT}`);
  console.log(`WebSocket running on ws://localhost:${PORT}`);
});
