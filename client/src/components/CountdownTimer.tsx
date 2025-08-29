import type { CountdownResponse } from '../../../server/src/schema';

interface CountdownTimerProps {
  countdown: CountdownResponse;
}

export function CountdownTimer({ countdown }: CountdownTimerProps) {
  if (countdown.is_live) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl font-bold font-orbitron text-green-400 glow-text">
          🎉 大会进行中 🎉
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="text-2xl font-rajdhani text-cyan-300 mb-4">距离大会开始还有</div>
      <div className="flex justify-center gap-8">
        <div className="text-center hover-particles glow-border rounded-lg p-6 bg-black/30 backdrop-blur-sm">
          <div className="text-5xl font-bold font-orbitron text-cyan-400 glow-text pulse-glow">
            {countdown.days}
          </div>
          <div className="text-sm font-rajdhani text-gray-300 mt-2">天</div>
        </div>
        <div className="text-center hover-particles glow-border rounded-lg p-6 bg-black/30 backdrop-blur-sm">
          <div className="text-5xl font-bold font-orbitron text-purple-400 glow-text pulse-glow">
            {countdown.hours}
          </div>
          <div className="text-sm font-rajdhani text-gray-300 mt-2">小时</div>
        </div>
        <div className="text-center hover-particles glow-border rounded-lg p-6 bg-black/30 backdrop-blur-sm">
          <div className="text-5xl font-bold font-orbitron text-green-400 glow-text pulse-glow">
            {countdown.minutes}
          </div>
          <div className="text-sm font-rajdhani text-gray-300 mt-2">分</div>
        </div>
        <div className="text-center hover-particles glow-border rounded-lg p-6 bg-black/30 backdrop-blur-sm">
          <div className="text-5xl font-bold font-orbitron text-orange-400 glow-text pulse-glow">
            {countdown.seconds}
          </div>
          <div className="text-sm font-rajdhani text-gray-300 mt-2">秒</div>
        </div>
      </div>
    </div>
  );
}