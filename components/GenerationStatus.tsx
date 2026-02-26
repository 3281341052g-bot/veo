import { GenerationStatus as IGenerationStatus } from '@/lib/types';

interface GenerationStatusProps {
  status: IGenerationStatus;
  onReset: () => void;
}

export default function GenerationStatus({ status, onReset }: GenerationStatusProps) {
  const statusConfig = {
    pending: { icon: '⏸️', label: '等待中', color: 'text-gray-400' },
    processing: { icon: '⚙️', label: '生成中，请耐心等待（约 2-5 分钟）...', color: 'text-blue-400' },
    completed: { icon: '✅', label: '生成完成！', color: 'text-green-400' },
    failed: { icon: '❌', label: '生成失败', color: 'text-red-400' },
  };

  const config = statusConfig[status.status];

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <div>
            <p className={`font-medium ${config.color}`}>{config.label}</p>
            {status.error && (
              <p className="text-sm text-red-300 mt-0.5">{status.error}</p>
            )}
            {status.status === 'processing' && (
              <div className="mt-2 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            )}
          </div>
        </div>
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
  );
}
