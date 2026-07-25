import { LayoutDashboard, AlertTriangle, Brain, ToggleLeft, ClipboardList } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
  shortLabel: string;
}

export const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview', shortLabel: 'Overview' },
  { path: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts', shortLabel: 'Alerts' },
  { path: '/dashboard/explain', icon: Brain, label: 'Explainability', shortLabel: 'Explain' },
  { path: '/dashboard/false-positives', icon: ToggleLeft, label: 'FP Control', shortLabel: 'FP' },
  { path: '/dashboard/action-log', icon: ClipboardList, label: 'Action Log', shortLabel: 'Log' },
];
