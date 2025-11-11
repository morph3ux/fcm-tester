import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceAccount, token, title, body: messageBody, iconUrl, data } = body;

    if (!serviceAccount || !token || !title || !messageBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const projectId = serviceAccount.project_id;
    if (!projectId) {
      return NextResponse.json({ error: 'Invalid service account JSON' }, { status: 400 });
    }

    let app;
    const apps = getApps();
    const existingApp = apps.find(a => a.name === projectId);
    if (existingApp) {
      app = existingApp;
    } else {
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId,
      }, projectId);
    }

    const messaging = getMessaging(app);

    const messagePayload: Message = {
      token,
      notification: {
        title,
        body: messageBody,
        ...(iconUrl && { icon: iconUrl }),
      } as any,
    };

    if (data) {
      messagePayload.data = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      );
    }

    await messaging.send(messagePayload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}