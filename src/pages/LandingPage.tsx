import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Eye, Brain, Bell, CheckCircle, Zap, Lock, TrendingDown, ChevronDown } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { number: 30, suffix: '%', label: 'of data breaches involve insiders', icon: TrendingDown },
  { number: 15.4, prefix: '$', suffix: 'M', label: 'average cost per insider incident', icon: Zap },
  { number: 85, suffix: ' days', label: 'avg time to contain an insider threat', icon: Lock },
];

const STEPS = [
  { icon: Eye, title: 'Ingest Logs', desc: 'Collects login, file access, and transfer events from your environment in real-time' },
  { icon: Brain, title: 'Build Baseline', desc: 'Learns each user\'s normal behavior patterns over a rolling 30-day window' },
  { icon: Bell, title: 'Detect Anomalies', desc: 'Scores deviations using z-score analysis — no hardcoded rules' },
  { icon: CheckCircle, title: 'Explain & Alert', desc: 'Every alert includes a plain-English explanation with contributing factors' },
];

const FEATURES: { title: string; desc: string; icon: React.ElementType; color: string }[] = [
  { title: 'Statistical, Not Rules', desc: 'Per-user behavioral baselines with z-score deviation scoring. No hardcoded thresholds.', icon: Brain, color: 'cyan' },
  { title: 'Full Explainability', desc: 'Every alert shows contributing factors with weights. Understand why it was flagged.', icon: Eye, color: 'emerald' },
  { title: 'Feedback Loop', desc: 'Mark false positives to recalibrate baselines. Accuracy improves over time.', icon: CheckCircle, color: 'amber' },
];

function useCountUp(end: number, duration = 2000, startOnView = false, inView = true) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (startOnView && !inView) return;
    if (started.current) return;
    started.current = true;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, startOnView, inView]);
  return count;
}

function AnimatedStat({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(stat.number, 2200, true, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
        <stat.icon size={22} className="text-cyan-400" />
      </div>
      <p className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
        {stat.prefix || ''}{stat.number >= 10 ? Math.round(count) : count.toFixed(1)}{stat.suffix}
      </p>
      <p className="text-sm text-white/35 leading-relaxed">{stat.label}</p>
    </motion.div>
  );
}

function FloatingOrb({ className, style }: { className: string; style?: React.CSSProperties }) {
  return <div className={`absolute rounded-full blur-3xl animate-float ${className}`} style={style} />;
}

interface StepData { icon: React.ElementType; title: string; desc: string; }

function StepCard({ step, index, total }: { step: StepData; index: number; total: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {index < total - 1 && (
        <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-cyan-500/15 to-transparent z-0" />
      )}
      <div className="glass-card rounded-2xl p-6 h-full relative z-10">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/8 border border-cyan-500/12 flex items-center justify-center mb-4 group-hover:bg-cyan-500/12 transition-colors duration-300">
          <step.icon size={20} className="text-cyan-400" />
        </div>
        <div className="text-[10px] text-cyan-400/40 font-mono mb-2 tracking-widest">STEP {String(index + 1).padStart(2, '0')}</div>
        <h3 className="font-display text-base font-semibold text-white mb-2">{step.title}</h3>
        <p className="text-sm text-white/30 leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

interface FeatureData { title: string; desc: string; icon: React.ElementType; color: string; }

function FeatureCard({ feature, index }: { feature: FeatureData; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    cyan: { bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.12)', icon: '#22d3ee' },
    emerald: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.12)', icon: '#10b981' },
    amber: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.12)', icon: '#f59e0b' },
  };
  const c = colors[feature.color];
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-7 group"
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <feature.icon size={20} style={{ color: c.icon }} />
      </div>
      <h3 className="font-display text-base font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-sm text-white/30 leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

/* ── Dashboard Preview Mock ── */

function DashboardPreview() {
  return (
    <div className="glass-card rounded-2xl p-1 animate-hero-glow">
      <div className="rounded-xl overflow-hidden bg-navy-900/60">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          </div>
          <div className="flex-1 mx-4 h-5 rounded-md bg-navy-800/60 flex items-center justify-center">
            <span className="text-[9px] text-white/15 font-mono">sentinelx.onrender.com/dashboard</span>
          </div>
        </div>
        <div className="p-3 space-y-2">
          {/* Stat cards row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { color: '#ef4444', label: 'Critical', value: '1' },
              { color: '#f97316', label: 'High', value: '9' },
              { color: '#10b981', label: 'Resolved', value: '42' },
              { color: '#22d3ee', label: 'Active', value: '201' },
            ].map((s, i) => (
              <div key={i} className="rounded-lg bg-navy-800/40 p-2.5 border border-white/[0.03]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-[8px] text-white/25 font-medium">{s.label}</span>
                </div>
                <p className="font-display text-lg font-bold text-white/70">{s.value}</p>
              </div>
            ))}
          </div>
          {/* Chart + sidebar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 rounded-lg bg-navy-800/30 p-3 border border-white/[0.03]">
              <div className="text-[8px] text-white/20 mb-2 font-medium">ALERTS BY SEVERITY</div>
              <div className="flex items-end gap-1 h-16">
                {[40, 65, 30, 80, 55, 70, 45, 60, 35, 75, 50, 85].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{
                    height: `${h}%`,
                    background: i % 3 === 0 ? 'rgba(239,68,68,0.3)' : i % 3 === 1 ? 'rgba(249,115,22,0.25)' : 'rgba(34,211,238,0.2)',
                  }} />
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-navy-800/30 p-3 border border-white/[0.03]">
              <div className="text-[8px] text-white/20 mb-2 font-medium">RISK SCORE</div>
              <div className="relative w-14 h-14 mx-auto">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(34,211,238,0.08)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="3"
                    strokeDasharray="97.4" strokeDashoffset="25" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white/60">74</span>
                </div>
              </div>
            </div>
          </div>
          {/* Alert list */}
          <div className="rounded-lg bg-navy-800/30 p-2 border border-white/[0.03] space-y-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-navy-900/30">
                <div className="w-5 h-5 rounded-full flex-shrink-0" style={{
                  background: i === 1 ? 'rgba(239,68,68,0.15)' : i === 2 ? 'rgba(249,115,22,0.12)' : 'rgba(34,211,238,0.1)',
                }} />
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 rounded-full bg-white/[0.04]" style={{ width: `${60 + i * 10}%` }} />
                </div>
                <div className="h-4 w-10 rounded-full" style={{
                  background: i === 1 ? 'rgba(239,68,68,0.12)' : i === 2 ? 'rgba(249,115,22,0.1)' : 'rgba(34,211,238,0.08)',
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' });
  const scrollToContent = useCallback(() => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <FloatingOrb className="w-[600px] h-[600px] bg-cyan-500/[0.04] top-1/4 left-1/4" />
        <FloatingOrb className="w-[450px] h-[450px] bg-red-500/[0.025] bottom-1/4 right-1/4" style={{ animationDelay: '3s' }} />
        <FloatingOrb className="w-[350px] h-[350px] bg-purple-500/[0.02] top-1/2 left-1/2" style={{ animationDelay: '5s' }} />
        <div className="absolute inset-0 scan-line" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card-strong border-b border-cyan-500/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <Shield size={16} className="text-navy-950" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight">SentinelX</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#how-it-works" className="hidden sm:block text-xs text-white/40 hover:text-white/60 transition-colors">How It Works</a>
            <Link to="/dashboard" className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/15 text-cyan-400 text-xs font-medium hover:bg-cyan-500/15 transition-all duration-200">
              Dashboard <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/[0.06] border border-cyan-500/10 text-cyan-400 text-[11px] font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
              Autonomous Insider Threat Detection
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-5">
            Catch the threat<br />
            <span className="animate-text-shimmer">
              before the damage is done.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-white/35 max-w-2xl mx-auto mb-8 leading-relaxed">
            Insider threats blend into normal behavior. Static rules miss them.
            SentinelX builds per-user behavioral baselines and flags statistically significant
            deviations — with full explainability.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-navy-950 font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]">
              <Shield size={16} />
              Launch Live Demo
            </Link>
            <button onClick={scrollToContent}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-navy-800/40 border border-white/8 text-white/50 font-medium text-sm hover:bg-navy-700/40 hover:text-white/70 hover:border-white/12 transition-all duration-200">
              How It Works <ArrowRight size={13} />
            </button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto">
            <DashboardPreview />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="flex justify-center mt-10">
          <button onClick={scrollToContent} className="text-white/15 hover:text-white/30 transition-colors animate-bounce">
            <ChevronDown size={24} />
          </button>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {STATS.map((stat, i) => <AnimatedStat key={i} stat={stat} index={i} />)}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <motion.div ref={stepsRef} initial={{ opacity: 0, y: 16 }} animate={stepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <span className="text-[10px] text-cyan-400/50 uppercase tracking-[0.2em] font-medium">Process</span>
              <h2 className="font-display text-2xl md:text-4xl font-bold mt-2 mb-3">
                How <span className="text-cyan-400">SentinelX</span> Works
              </h2>
              <p className="text-white/25 max-w-md mx-auto text-sm">
                Four steps from raw logs to actionable security alerts
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <StepCard key={i} step={step} index={i} total={STEPS.length} />
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/[0.06] to-transparent" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] text-cyan-400/50 uppercase tracking-[0.2em] font-medium">Philosophy</span>
            <h2 className="font-display text-2xl md:text-4xl font-bold mt-2 mb-3">
              Built for <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Trust</span>
            </h2>
            <p className="text-white/25 max-w-md mx-auto text-sm">
              Every design decision answers: "Why should we trust this system?"
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] text-cyan-400/50 uppercase tracking-[0.2em] font-medium">Stack</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 mb-8">Powered by Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'Recharts', 'Express.js', 'SQLite', 'WebSocket'].map((tech, i) => (
              <motion.div key={tech}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="px-4 py-2 rounded-lg glass-card text-xs text-white/40 font-medium hover:text-cyan-400/70 transition-colors duration-200 cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-10 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <Shield size={40} className="mx-auto mb-5 text-cyan-400/80" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">See SentinelX in Action</h2>
            <p className="text-white/30 mb-8 max-w-sm mx-auto text-sm">
              Live dashboard with 200 simulated users and real-time anomaly detection
            </p>
            <Link to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-navy-950 font-bold text-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]">
              Launch Dashboard <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.04] relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center">
              <Shield size={12} className="text-cyan-400" />
            </div>
            <span className="text-xs text-white/25">SentinelX — InnovaHack Chapter 1</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-white/15">
            <span>Cybersecurity — Problem Statement 1</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Team: Thanuj Mori, Likith Tholapu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
