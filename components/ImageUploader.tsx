'use client';

import { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUploaded: (base64: string, mimeType: string) => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.base64) {
          setPreview(URL.createObjectURL(file));
          onImageUploaded(data.base64, data.mimeType);
        }
      } catch {
        console.error('Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      className={`bg-[#111111] border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 hover:border-white/20'
      }`}
    >
      {preview ? (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
          <button
            onClick={() => { setPreview(''); onImageUploaded('', ''); }}
            className="text-sm text-red-400 hover:text-red-300"
          >
            移除图片
          </button>
        </div>
      ) : (
        <label className="cursor-pointer space-y-2 block">
          <div className="text-4xl">{isUploading ? '⏳' : '📁'}</div>
          <p className="text-gray-400 text-sm">
            {isUploading ? '上传中...' : '拖拽图片到此处，或点击选择文件'}
          </p>
          <p className="text-gray-600 text-xs">支持 JPG、PNG、WebP 格式</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
