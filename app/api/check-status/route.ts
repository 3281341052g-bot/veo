import { NextRequest, NextResponse } from 'next/server';
import { checkOperationStatus } from '@/lib/vertexai';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operationName = searchParams.get('operationName');

    if (!operationName) {
      return NextResponse.json({ error: 'operationName is required' }, { status: 400 });
    }

    const statusData = await checkOperationStatus(operationName);

    if (statusData.done) {
      const err = statusData.error as Record<string, unknown> | undefined;
      if (err) {
        return NextResponse.json({ status: 'failed', error: err.message });
      }

      const response = statusData.response as Record<string, unknown> | undefined;
      const predictions = response?.predictions as Array<Record<string, unknown>> | undefined;
      const video = predictions?.[0]?.video as Record<string, unknown> | undefined;
      const videoUrl = video?.uri || video?.bytesBase64Encoded;

      return NextResponse.json({
        status: 'completed',
        videoUrl,
      });
    }

    return NextResponse.json({ status: 'processing' });
  } catch (error) {
    console.error('Check status error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check status' },
      { status: 500 }
    );
  }
}
