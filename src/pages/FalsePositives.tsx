import { useState } from 'react';
import { CheckCircle, XCircle, TrendingDown, AlertTriangle, BarChart3, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useUserMap } from '../hooks/useUserMap';
import type { Alert, User } from '../types';

interface FalsePositivesProps {
  alerts: Alert[];
  users: User[];
  onMarkAlert: (alertId: string, status: 'confirmed_threat' | 'false_positive') => Promise<void>;
}

export default function FalsePositives({ alerts, users, onMarkAlert }: FalsePositivesProps) {
  const [selectedTab, setSelectedTab] = useState<'review' | 'history'>('review');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<'confirmed_threat' | 'false_positive' | null>(null);
  const [marking, setMarking] = useState(false);

  const userMap = useUserMap(users);
  const reviewableAlerts = alerts.filter((a: Alert) => a.status === 'active' || a.status === 'investigating');
  const resolvedAlerts = alerts.filter((a: Alert) => a.status === 'confirmed_threat' || a.status === 'false_positive');
  const confirmedCount = alerts.filter((a: Alert) => a.status === 'confirmed_threat').length;
  const falsePositiveCount = alerts.filter((a: Alert) => a.status === 'false_positive').length;
  const totalResolved = confirmedCount + falsePositiveCount;
  const falsePositiveRate = totalResolved > 0 ? Math.round((falsePositiveCount / totalResolved) * 100) : 0;

  const handleMark = (id: string, status: 'confirmed_threat' | 'false_positive') => { setConfirmId(id); setConfirmStatus(status); };

  const confirmMark = async () => {
    if (!confirmId || !confirmStatus) return;
    setMarking(true);
    try {
      await onMarkAlert(confirmId, confirmStatus);
      toast.success(confirmStatus === 'false_positive' ? 'Marked as false positive' : 'Threat confirmed');
    } catch { toast.error('Failed to update'); }
    setConfirmId(null); setConfirmStatus(null); setMarking(false);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {confirmId && confirmStatus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card rounded-2xl p-6 max-w-sm mx-4 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${confirmStatus === 'confirmed_threat' ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                  {confirmStatus === 'confirmed_threat' ? <AlertTriangle size={18} className="text-red-400" /> : <CheckCircle size={18} className="text-emerald-400" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{confirmStatus === 'confirmed_threat' ? 'Confirm Threat?' : 'Mark as False Positive?'}</h3>
                  <p className="text-xs text-white/40">This will update the user&apos;s behavioral baseline.</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setConfirmId(null); setConfirmStatus(null); }} disabled={marking} className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-white/60 text-xs font-medium hover:bg-navy-800/50 transition-all disabled:opacity-50">Cancel</button>
                <button onClick={confirmMark} disabled={marking} className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${confirmStatus === 'confirmed_threat' ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'}`}>
                  {marking ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div><h1 className="font-display text-2xl font-bold text-white">False Positive Control Center</h1><p className="text-sm text-white/40 mt-1">Mark alerts to improve detection accuracy</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center"><AlertTriangle size={18} className="text-red-400" /></div><div><p className="text-xs text-white/40">Confirmed Threats</p><p className="text-xl font-bold text-white">{confirmedCount}</p></div></div></div>
        <div className="glass-card rounded-xl p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center"><CheckCircle size={18} className="text-emerald-400" /></div><div><p className="text-xs text-white/40">False Positives</p><p className="text-xl font-bold text-white">{falsePositiveCount}</p></div></div></div>
        <div className="glass-card rounded-xl p-5"><div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center"><TrendingDown size={18} className="text-cyan-400" /></div><div><p className="text-xs text-white/40">FP Rate</p><p className="text-xl font-bold text-white">{falsePositiveRate}%</p></div></div></div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4"><BarChart3 size={18} className="text-cyan-400" /><p className="text-sm font-semibold text-white">Feedback Impact</p></div>
        <div className="flex items-center gap-4">
          <div className="flex-1"><div className="flex justify-between text-xs text-white/40 mb-1"><span>Confirmed Threats</span><span>{totalResolved > 0 ? Math.round((confirmedCount / totalResolved) * 100) : 0}%</span></div><div className="h-3 bg-navy-800 rounded-full overflow-hidden"><div className="h-full bg-red-500/70 rounded-full transition-all duration-500" style={{ width: `${totalResolved > 0 ? (confirmedCount / totalResolved) * 100 : 0}%` }} /></div></div>
          <div className="flex-1"><div className="flex justify-between text-xs text-white/40 mb-1"><span>False Positives</span><span>{falsePositiveRate}%</span></div><div className="h-3 bg-navy-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500/70 rounded-full transition-all duration-500" style={{ width: `${falsePositiveRate}%` }} /></div></div>
        </div>
        <div className="flex items-start gap-2 mt-3"><Info size={12} className="text-white/30 mt-0.5 shrink-0" /><p className="text-xs text-white/30">Marking false positives recalibrates baselines for affected users.</p></div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSelectedTab('review')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTab === 'review' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-white/40 hover:text-white/60 border border-transparent'}`}>Review ({reviewableAlerts.length})</button>
        <button onClick={() => setSelectedTab('history')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedTab === 'history' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-white/40 hover:text-white/60 border border-transparent'}`}>History ({resolvedAlerts.length})</button>
      </div>

      {selectedTab === 'review' && <div className="space-y-3">{reviewableAlerts.map((alert: Alert) => { const user = userMap.get(alert.userId); return (
        <div key={alert.id} className="glass-card rounded-xl p-4 flex items-center gap-4 flex-wrap">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: `${user?.avatarColor}20`, color: user?.avatarColor }}>{user?.name.split(' ').map((n: string) => n[0]).join('')}</div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{user?.name} — {alert.explanation}</p><p className="text-xs text-white/40">{alert.id} · Risk: {alert.riskScore} · {alert.severity.toUpperCase()}</p></div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => handleMark(alert.id, 'confirmed_threat')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"><XCircle size={14} />Threat</button>
            <button onClick={() => handleMark(alert.id, 'false_positive')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"><CheckCircle size={14} />False Positive</button>
          </div>
        </div>); })}</div>}

      {selectedTab === 'history' && <div className="space-y-3">{resolvedAlerts.map((alert: Alert) => { const user = userMap.get(alert.userId); return (
        <div key={alert.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${alert.status === 'confirmed_threat' ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
            {alert.status === 'confirmed_threat' ? <XCircle size={18} className="text-red-400" /> : <CheckCircle size={18} className="text-emerald-400" />}
          </div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{user?.name} — {alert.explanation}</p><p className="text-xs text-white/40">{alert.id} · Risk: {alert.riskScore}</p></div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${alert.status === 'confirmed_threat' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{alert.status === 'confirmed_threat' ? 'CONFIRMED' : 'FALSE POSITIVE'}</span>
        </div>); })}</div>}
    </div>
  );
}
