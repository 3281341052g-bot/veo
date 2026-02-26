import { GenerationParams } from '@/lib/types';

interface ParameterPanelProps {
  params: GenerationParams;
  onChange: (params: GenerationParams) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

function OptionGroup<T extends string | number | boolean>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            value === opt.value
              ? 'border-blue-500 bg-blue-500/20 text-blue-300'
              : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function ParameterPanel({ params, onChange }: ParameterPanelProps) {
  const update = <K extends keyof GenerationParams>(key: K, value: GenerationParams[K]) =>
    onChange({ ...params, [key]: value });

  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-5 space-y-5">
      <h3 className="font-semibold text-sm">生成参数</h3>

      <Section title="画面比例">
        <OptionGroup
          options={[
            { label: '横屏 16:9', value: '16:9' as const },
            { label: '竖屏 9:16', value: '9:16' as const },
          ]}
          value={params.aspectRatio}
          onChange={(v) => update('aspectRatio', v)}
        />
      </Section>

      <Section title="视频时长">
        <OptionGroup
          options={[
            { label: '5 秒', value: 5 as const },
            { label: '8 秒', value: 8 as const },
          ]}
          value={params.duration}
          onChange={(v) => update('duration', v)}
        />
      </Section>

      <Section title="分辨率">
        <OptionGroup
          options={[
            { label: '720p', value: '720p' as const },
            { label: '1080p', value: '1080p' as const },
          ]}
          value={params.resolution}
          onChange={(v) => update('resolution', v)}
        />
      </Section>

      <Section title="音频">
        <OptionGroup
          options={[
            { label: '生成音频', value: true },
            { label: '无音频', value: false },
          ]}
          value={params.generateAudio}
          onChange={(v) => update('generateAudio', v)}
        />
      </Section>
    </div>
  );
}
