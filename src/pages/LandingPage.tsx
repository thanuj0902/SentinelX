import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Eye, Brain, Bell, CheckCircle, Zap, Lock, TrendingDown } from 'lucide-react';

const STATS = [
  { number: '30%', label: 'of data breaches involve insiders', icon: TrendingDown },
  { number: '$15.4M', label: 'average cost of an insider threat', icon: Zap },
  { number: '85 days', label: 'average time to contain an insider incident', icon: Lock },
];

const STEPS = [
  { icon: Eye, title: 'Ingest Logs', desc: 'Continuously collects login, file access, and transfer events from your environment' },
  { icon: Brain, title: 'Build Baseline', desc: 'Learns each user\'s normal behavior patterns over a rolling 30-day window' },
  { icon: Bell, title: 'Detect Anomalies', desc: 'Scores deviations statistically — no hardcoded rules, pure behavioral analysis' },
  { icon: CheckCircle, title: 'Explain & Alert', desc: 'Every alert comes with a plain-English explanation of why it was flagged' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <Shield size={18} className="text-navy-950" />
            </div>
            <span className="font-display font-bold text-lg">SentinelX</span>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all"
          >
            View Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-glow" />
            Autonomous Insider Threat Detection
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
            Catch the threat<br />
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              before the damage is done.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Insider threats blend into normal behavior. Static rules can't catch them.
            SentinelX builds per-user behavioral baselines and flags statistically significant
            deviations — with full explainability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-navy-950 font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              <Shield size={18} />
              Launch Live Demo
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-navy-800 border border-white/10 text-white/70 font-medium text-sm hover:bg-navy-700 hover:text-white transition-all"
            >
              How It Works
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="glass-card rounded-xl p-6 text-center animate-slide-up" style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}>
              <stat.icon size={24} className="mx-auto mb-3 text-cyan-400/60" />
              <p className="font-display text-3xl font-bold text-white mb-1">{stat.number}</p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-cyan-400">SentinelX</span> Works
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Four steps from raw logs to actionable, explainable security alerts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-cyan-500/20 to-transparent z-0" />
                )}
                <div className="glass-card rounded-xl p-6 h-full relative z-10 animate-slide-up" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                    <step.icon size={22} className="text-cyan-400" />
                  </div>
                  <div className="text-xs text-cyan-400/60 font-mono mb-2">Step {i + 1}</div>
                  <h3 className="font-display text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 bg-navy-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Built for <span className="text-cyan-400">Trust</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Every design decision answers the question: "Why should we trust this system?"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Statistical, Not Rules', desc: 'Per-user behavioral baselines with z-score deviation scoring. No hardcoded "if after 6pm" logic.', icon: Brain },
              { title: 'Full Explainability', desc: 'Every alert shows contributing factors with weights. Understand exactly why it was flagged.', icon: Eye },
              { title: 'Feedback Loop', desc: 'Mark false positives to improve baselines. False positive rate drops with every feedback cycle.', icon: CheckCircle },
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6">
                <f.icon size={24} className="text-cyan-400 mb-4" />
                <h3 className="font-display text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-12 bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/15">
            <Shield size={48} className="mx-auto mb-6 text-cyan-400" />
            <h2 className="font-display text-3xl font-bold mb-4">See SentinelX in Action</h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              Explore the live dashboard with 200 simulated users and real-time anomaly detection
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-navy-950 font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Launch Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center">
              <Shield size={12} className="text-cyan-400" />
            </div>
            <span className="text-sm text-white/40">SentinelX — InnovaHack Chapter 1</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>Cybersecurity — Problem Statement 1</span>
            <span>·</span>
            <span>Team: Thanuj Mori, Likith Tholapu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
