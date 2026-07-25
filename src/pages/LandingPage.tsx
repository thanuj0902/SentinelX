import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Eye, Brain, Bell, CheckCircle, Zap, Lock, TrendingDown, ChevronDown } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { number: 30, suffix: '%', label: 'of data breaches involve insiders', icon: TrendingDown },
  { number: 15.4, prefix: '$', suffix: 'M', label: 'average cost of an insider threat', icon: Zap },
  { number: 85, suffix: ' days', label: 'average time to contain an insider incident', icon: Lock },
];

const STEPS = [
  { icon: Eye, title: 'Ingest Logs', desc: 'Continuously collects login, file access, and transfer events from your environment' },
  { icon: Brain, title: 'Build Baseline', desc: 'Learns each user\'s normal behavior patterns over a rolling 30-day window' },
  { icon: Bell, title: 'Detect Anomalies', desc: 'Scores deviations statistically — no hardcoded rules, pure behavioral analysis' },
  { icon: CheckCircle, title: 'Explain & Alert', desc: 'Every alert comes with a plain-English explanation of why it was flagged' },
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
  const count = useCountUp(stat.number, 2000, true, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group hover:animate-border-glow"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <stat.icon size={28} className="mx-auto mb-4 text-cyan-400/60 group-hover:text-cyan-400 transition-colors" />
      <p className="font-display text-4xl font-bold text-white mb-2">
        {stat.prefix || ''}{stat.number >= 10 ? Math.round(count) : count.toFixed(1)}{stat.suffix}
      </p>
      <p className="text-sm text-white/40">{stat.label}</p>
    </motion.div>
  );
}

function FloatingOrb({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute rounded-full blur-3xl animate-float ${className}`} style={style} />
  );
}

export default function LandingPage() {
  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' });

  const scrollToContent = useCallback(() => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <FloatingOrb className="w-[500px] h-[500px] bg-cyan-500/5 top-1/4 left-1/4" />
        <FloatingOrb className="w-[400px] h-[400px] bg-red-500/4 bottom-1/4 right-1/4" style={{ animationDelay: '2s' } as React.CSSProperties} />
        <FloatingOrb className="w-[300px] h-[300px] bg-purple-500/3 top-1/2 left-1/2" style={{ animationDelay: '4s' } as React.CSSProperties} />
        <div className="absolute inset-0 scan-line" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card-strong border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center glow-cyan">
              <Shield size={18} className="text-navy-950" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">SentinelX</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors">How It Works</a>
            <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
              Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-8 animate-border-glow">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-glow" />
              Autonomous Insider Threat Detection
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
            Catch the threat<br />
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent animate-gradient">
              before the damage is done.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed">
            Insider threats blend into normal behavior. Static rules can't catch them.
            SentinelX builds per-user behavioral baselines and flags statistically significant
            deviations — with full explainability.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-navy-950 font-bold text-sm hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <Shield size={18} />
              Launch Live Demo
            </Link>
            <button onClick={scrollToContent}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-navy-800/50 border border-white/10 text-white/60 font-medium text-sm hover:bg-navy-700/50 hover:text-white hover:border-white/20 transition-all duration-300">
              How It Works
              <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 mx-auto max-w-4xl">
            <div className="glass-card rounded-2xl p-1 animate-border-glow">
              <div className="rounded-xl overflow-hidden bg-navy-900/50 p-2">
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="flex-1 mx-4 h-5 rounded-md bg-navy-800/50 flex items-center justify-center">
                    <span className="text-[10px] text-white/20 font-mono">sentinelx.vercel.app/dashboard</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {['#ef444420', '#f9731620', '#10b98120', '#22d3ee20'].map((c, i) => (
                    <div key={i} className="h-16 rounded-lg" style={{ background: c }} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 h-32 rounded-lg bg-navy-800/30 animate-shimmer" />
                  <div className="h-32 rounded-lg bg-navy-800/30 animate-shimmer" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="flex justify-center mt-12">
          <button onClick={scrollToContent} className="text-white/20 hover:text-white/40 transition-colors animate-bounce">
            <ChevronDown size={28} />
          </button>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => <AnimatedStat key={i} stat={stat} index={i} />)}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.div ref={stepsRef} initial={{ opacity: 0, y: 20 }} animate={stepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <span className="text-xs text-cyan-400/60 uppercase tracking-widest font-medium">Process</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-4">
                How <span className="text-cyan-400">SentinelX</span> Works
              </h2>
              <p className="text-white/35 max-w-lg mx-auto">
                Four steps from raw logs to actionable, explainable security alerts
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => {
              const cardRef = useRef(null);
              const inView = useInView(cardRef, { once: true, margin: '-50px' });
              return (
                <motion.div key={i} ref={cardRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-cyan-500/20 to-transparent z-0" />
                  )}
                  <div className="glass-card rounded-2xl p-7 h-full relative z-10 group-hover:glow-cyan transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center mb-5 group-hover:bg-cyan-500/15 group-hover:border-cyan-500/30 transition-all duration-300">
                      <step.icon size={24} className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="text-xs text-cyan-400/50 font-mono mb-2 tracking-wider">STEP {String(i + 1).padStart(2, '0')}</div>
                    <h3 className="font-display text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/35 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-24 px-6 bg-navy-900/30 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs text-cyan-400/60 uppercase tracking-widest font-medium">Philosophy</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-4">
              Built for <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Trust</span>
            </h2>
            <p className="text-white/35 max-w-lg mx-auto">
              Every design decision answers the question: "Why should we trust this system?"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Statistical, Not Rules', desc: 'Per-user behavioral baselines with z-score deviation scoring. No hardcoded "if after 6pm" logic.', icon: Brain, color: 'cyan' },
              { title: 'Full Explainability', desc: 'Every alert shows contributing factors with weights. Understand exactly why it was flagged.', icon: Eye, color: 'emerald' },
              { title: 'Feedback Loop', desc: 'Mark false positives to improve baselines. False positive rate drops with every feedback cycle.', icon: CheckCircle, color: 'amber' },
            ].map((f, i) => {
              const cardRef = useRef(null);
              const inView = useInView(cardRef, { once: true, margin: '-50px' });
              return (
                <motion.div key={i} ref={cardRef}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="glass-card rounded-2xl p-8 group hover:animate-border-glow"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${f.color}-500/10 border border-${f.color}-500/15 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                    style={{ background: f.color === 'cyan' ? 'rgba(34,211,238,0.1)' : f.color === 'emerald' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', borderColor: f.color === 'cyan' ? 'rgba(34,211,238,0.15)' : f.color === 'emerald' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)' }}>
                    <f.icon size={24} style={{ color: f.color === 'cyan' ? '#22d3ee' : f.color === 'emerald' ? '#10b981' : '#f59e0b' }} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-3">{f.title}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs text-cyan-400/60 uppercase tracking-widest font-medium">Stack</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-10">Powered by Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Zustand', 'Framer Motion', 'Recharts', 'Express.js', 'SQLite', 'WebSocket'].map((tech, i) => (
              <motion.div key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-2.5 rounded-xl glass-card text-sm text-white/50 font-medium hover:text-cyan-400 hover:border-cyan-500/20 transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-14 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent border border-cyan-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <Shield size={52} className="mx-auto mb-6 text-cyan-400 glow-cyan rounded-2xl" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">See SentinelX in Action</h2>
            <p className="text-white/35 mb-10 max-w-md mx-auto">
              Explore the live dashboard with 200 simulated users and real-time anomaly detection
            </p>
            <Link to="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-navy-950 font-bold text-sm hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              Launch Dashboard
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Shield size={13} className="text-cyan-400" />
            </div>
            <span className="text-sm text-white/30">SentinelX — InnovaHack Chapter 1</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/20">
            <span>Cybersecurity — Problem Statement 1</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Team: Thanuj Mori, Likith Tholapu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
