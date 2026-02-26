import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

export async function getAccessToken(): Promise<string> {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token || '';
}

export async function generateVideo(request: Record<string, unknown>): Promise<string> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  const modelId = process.env.VEO_MODEL_ID || 'veo-3.0-generate-preview';

  const accessToken = await getAccessToken();

  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predictLongRunning`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vertex AI API error: ${error}`);
  }

  const data = await response.json();
  return data.name as string;
}

export async function checkOperationStatus(operationName: string): Promise<Record<string, unknown>> {
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  const accessToken = await getAccessToken();

  const url = `https://${location}-aiplatform.googleapis.com/v1/${operationName}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Status check error: ${error}`);
  }

  return response.json() as Promise<Record<string, unknown>>;
}
