import { NextRequest, NextResponse } from 'next/server';
import { generateVideo } from '@/lib/vertexai';
import { VideoGenerationRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json();

    const vertexRequest: Record<string, unknown> = {
      instances: [
        {
          prompt: body.prompt,
          ...(body.imageData && {
            image: {
              bytesBase64Encoded: body.imageData,
              mimeType: body.imageMimeType || 'image/jpeg',
            },
          }),
        },
      ],
      parameters: {
        aspectRatio: body.params.aspectRatio,
        durationSeconds: body.params.duration,
        resolution: body.params.resolution,
        generateAudio: body.params.generateAudio,
      },
    };

    const operationName = await generateVideo(vertexRequest);

    return NextResponse.json({ operationName });
  } catch (error) {
    console.error('Generate video error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate video' },
      { status: 500 }
    );
  }
}
