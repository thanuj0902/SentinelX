interface SensitivitySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function SensitivitySlider({ value, onChange }: SensitivitySliderProps) {
  const percentage = ((value - 0.5) / 2) * 100;

  const getLabel = (v: number) => {
    if (v < 0.8) return { text: 'Conservative', color: 'text-emerald-400' };
    if (v < 1.2) return { text: 'Balanced', color: 'text-cyan-400' };
    if (v < 1.6) return { text: 'Aggressive', color: 'text-amber-400' };
    return { text: 'Maximum', color: 'text-red-400' };
  };

  const label = getLabel(value);

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Detection Sensitivity</h3>
          <p className="text-xs text-white/40">Statistical deviation threshold — not rule-based</p>
        </div>
        <div className="text-right">
          <span className={`text-sm font-bold ${label.color}`}>{label.text}</span>
          <p className="text-xs text-white/30">{value.toFixed(1)}x</p>
        </div>
      </div>

      <div className="relative">
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              value < 0.8 ? 'bg-emerald-500' :
              value < 1.2 ? 'bg-cyan-500' :
              value < 1.6 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-emerald-400/60">0.5x Fewer alerts</span>
        <span className="text-[10px] text-red-400/60">2.5x More alerts</span>
      </div>
    </div>
  );
}
