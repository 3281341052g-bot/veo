interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function PromptInput({ value, onChange, placeholder }: PromptInputProps) {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-xl p-4">
      <label className="block text-sm font-medium text-gray-400 mb-2">提示词</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full bg-transparent text-white placeholder-gray-600 resize-none outline-none text-sm leading-relaxed"
      />
      <div className="flex justify-end mt-2">
        <span className="text-xs text-gray-600">{value.length} / 2000</span>
      </div>
    </div>
  );
}
