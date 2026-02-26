'use client';

import { useState, useEffect, useRef } from 'react';
import { GenerationStatus as IGenerationStatus } from '@/lib/types';

interface GenerationStatusProps {
  status: IGenerationStatus;
  onReset: () => void;
  startTime?: number | null;
}

function getPhaseLabel(progress: number): string {
  if (progress < 15) return '正在提交生成请求...';
  if (progress < 40) return 'AI 正在理解你的创意...';
  if (progress < 70) return '正在渲染视频画面...';
  if (progress < 90) return '正在生成音频和后处理...';
  if (progress < 100) return '即将完成，请稍候...';
  return '生成完成！';
}

function simulateProgress(elapsedMs: number): number {
  const s = elapsedMs / 1000;
  if (s <= 10) return (s / 10) * 15;
  if (s <= 60) return 15 + ((s - 10) / 50) * 25;
  if (s <= 150) return 40 + ((s - 60) / 90) * 30;
  if (s <= 240) return 70 + ((s - 150) / 90) * 20;
  return Math.min(99, 90 + ((s - 240) / 120) * 9);
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  if (minutes > 0) return `已用时间: ${minutes}分${seconds}秒`;
  return `已用时间: ${seconds}秒`;
}

export default function GenerationStatus({ status, onReset, startTime }: GenerationStatusProps) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status.status === 'processing') {
      const origin = startTime ?? Date.now();
      timerRef.current = setInterval(() => {
        const ms = Date.now() - origin;
        setElapsed(ms);
        setProgress(simulateProgress(ms));
      }, 1000);
    } else if (status.status === 'completed') {
      setProgress(100);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (status.status === 'failed') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setProgress(0);
      setElapsed(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status.status, startTime]);

  const statusConfig = {
    pending: { icon: '⏸️', color: 'text-gray-400' },
    processing: { icon: '⚙️', color: 'text-blue-400' },
    completed: { icon: '✅', color: 'text-green-400' },
    failed: { icon: '❌', color: 'text-red-400' },
  };

  const config = statusConfig[status.status];

  const barGradient =
    status.status === 'completed'
      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
      : status.status === 'failed'
      ? 'bg-gradient-to-r from-red-400 to-red-500'
      : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500';

  const barShadow =
    status.status === 'completed'
      ? 'shadow-[0_0_8px_2px_rgba(52,211,153,0.5)]'
      : status.status === 'failed'
      ? 'shadow-[0_0_8px_2px_rgba(248,113,113,0.5)]'
      : 'shadow-[0_0_8px_2px_rgba(139,92,246,0.5)]';

  const showProgress = status.status === 'processing' || status.status === 'completed' || status.status === 'failed';

  const phaseLabel =
    status.status === 'completed'
      ? '生成完成！'
      : status.status === 'failed'
      ? '生成失败'
      : getPhaseLabel(progress);

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <p className={`font-medium ${config.color}`}>{phaseLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            {showProgress && status.status !== 'pending' && (
              <span className="text-xs text-gray-400">{formatElapsed(elapsed)}</span>
            )}
            {(status.status === 'completed' || status.status === 'failed') && (
              <button
                onClick={onReset}
                className="px-3 py-1.5 text-sm bg-white/10 rounded-lg hover:bg-white/15 transition-colors"
              >
                重新生成
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {status.error && (
          <p className="text-sm text-red-300">{status.error}</p>
        )}

        {/* Progress bar */}
        {showProgress && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`relative h-full rounded-full ${barGradient} ${barShadow} transition-all duration-500 overflow-hidden`}
                  style={{ width: `${progress}%` }}
                >
                  {status.status === 'processing' && (
                    <div className="progress-shimmer absolute top-0 left-0 h-full w-1/4 bg-white/30 rounded-full" />
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-300 w-8 text-right">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Tip */}
        {status.status === 'processing' && (
          <p className="text-xs text-gray-500">💡 提示: Veo 通常需要 2-5 分钟生成视频</p>
        )}
      </div>
  );
}
