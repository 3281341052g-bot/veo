export interface GenerationParams {
  aspectRatio: '16:9' | '9:16';
  duration: 5 | 8;
  resolution: '720p' | '1080p';
  generateAudio: boolean;
}

export interface VideoGenerationRequest {
  prompt: string;
  params: GenerationParams;
  imageData?: string;
  imageMimeType?: string;
}

export interface GenerationStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  operationName?: string;
  videoUrl?: string;
  error?: string;
}

export interface VideoHistoryItem {
  id: string;
  prompt: string;
  params: GenerationParams;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}
