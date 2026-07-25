import type { LucideIcon } from 'lucide-react';
import { FileText, ArrowUpRight, LogIn } from 'lucide-react';

export const SEVERITY_COLORS: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

export const SEVERITY_BORDER_COLORS: Record<string, string> = {
  critical: 'border-red-500/40 bg-red-500/5',
  high: 'border-orange-500/40 bg-orange-500/5',
  medium: 'border-amber-500/40 bg-amber-500/5',
  low: 'border-cyan-500/20 bg-cyan-500/5',
};

export const SEVERITY_BADGES: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-cyan-500/10 text-cyan-400',
};

export const STATUS_BADGES: Record<string, string> = {
  active: 'bg-cyan-500/10 text-cyan-400',
  investigating: 'bg-amber-500/10 text-amber-400',
  confirmed_threat: 'bg-red-500/10 text-red-400',
  false_positive: 'bg-emerald-500/10 text-emerald-400',
};

export const EVENT_ICONS: Record<string, LucideIcon> = {
  login: LogIn,
  file_access: FileText,
  data_transfer: ArrowUpRight,
};

export function getRiskColor(score: number): string {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 35) return 'text-amber-400';
  return 'text-cyan-400';
}

export function getRiskBarColor(score: number): string {
  if (score >= 80) return 'bg-red-500';
  if (score >= 60) return 'bg-orange-500';
  if (score >= 35) return 'bg-amber-500';
  return 'bg-cyan-500';
}

export function getFactorColor(score: number): string {
  if (score > 30) return 'text-red-400';
  if (score > 15) return 'text-amber-400';
  return 'text-cyan-400';
}

export function getFactorBarColor(score: number): string {
  if (score > 30) return 'bg-red-500';
  if (score > 15) return 'bg-amber-500';
  return 'bg-cyan-500';
}
