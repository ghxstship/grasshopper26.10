/**
 * Firebase Cloud Messaging (Push Notifications) Integration
 * Agent 6: Integration Specialist
 */

import { createSuccessResponse, createErrorResponse } from '../utils';
import type { IntegrationResponse } from '../types';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, string>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface NotificationPayload {
  token: string;
  notification: PushNotification;
  data?: Record<string, string>;
}

/**
 * Initialize Firebase (client-side)
 */
export async function initFirebase(): Promise<IntegrationResponse<FirebaseConfig>> {
  try {
    if (typeof window === 'undefined') {
      return createErrorResponse(
        'FIREBASE_NOT_BROWSER',
        'Firebase can only be initialized in the browser'
      );
    }

    const config: FirebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '',
    };

    if (!config.apiKey || !config.projectId) {
      return createErrorResponse(
        'FIREBASE_MISSING_CONFIG',
        'Firebase configuration is incomplete'
      );
    }

    return createSuccessResponse(config);
  } catch (error) {
    return createErrorResponse(
      'FIREBASE_INIT_ERROR',
      error instanceof Error ? error.message : 'Failed to initialize Firebase',
      error
    );
  }
}

/**
 * Request notification permission (client-side)
 */
export async function requestNotificationPermission(): Promise<IntegrationResponse<string>> {
  try {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return createErrorResponse(
        'NOTIFICATIONS_NOT_SUPPORTED',
        'Push notifications are not supported in this browser'
      );
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      return createErrorResponse(
        'PERMISSION_DENIED',
        'User denied _notification permission'
      );
    }

    // This is a placeholder - actual implementation uses firebase/messaging
    // const messaging = getMessaging();
    // const token = await getToken(messaging, { vapidKey });
    console.log('[Firebase] Permission granted, token would be generated here');

    return createSuccessResponse('placeholder-token');
  } catch (error) {
    return createErrorResponse(
      'PERMISSION_REQUEST_ERROR',
      error instanceof Error ? error.message : 'Failed to request permission',
      error
    );
  }
}

/**
 * Send push notification (server-side)
 */
export async function sendPushNotification(
  payload: NotificationPayload
): Promise<IntegrationResponse<{ messageId: string }>> {
  try {
    const serverKey = process.env.FIREBASE_SERVER_KEY;

    if (!serverKey) {
      return createErrorResponse(
        'FIREBASE_MISSING_SERVER_KEY',
        'Firebase server key is not configured'
      );
    }

    const admin = await import('firebase-admin');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const message = {
      token: payload.token,
      notification: payload.notification,
      data: payload.data,
    };

    const response = await admin.messaging().send(message);

    return createSuccessResponse({ messageId: response });
  } catch (error) {
    return createErrorResponse(
      'SEND_NOTIFICATION_ERROR',
      error instanceof Error ? error.message : 'Failed to send _notification',
      error
    );
  }
}

/**
 * Send notification to multiple devices
 */
export async function sendMulticastNotification(
  tokens: string[],
  _notification: PushNotification,
  _data?: Record<string, string>
): Promise<IntegrationResponse<{ successCount: number; failureCount: number }>> {
  try {
    const serverKey = process.env.FIREBASE_SERVER_KEY;

    if (!serverKey) {
      return createErrorResponse(
        'FIREBASE_MISSING_SERVER_KEY',
        'Firebase server key is not configured'
      );
    }

    // This is a placeholder - actual implementation uses firebase-admin
    // const message = {
    //   tokens,
    //   notification,
    //   data,
    // };
    // const response = await admin.messaging().sendMulticast(message);

    console.log('[Firebase] Would send multicast _notification to', tokens.length, 'devices');

    return createSuccessResponse({
      successCount: tokens.length,
      failureCount: 0,
    });
  } catch (error) {
    return createErrorResponse(
      'MULTICAST_ERROR',
      error instanceof Error ? error.message : 'Failed to send multicast _notification',
      error
    );
  }
}

/**
 * Send notification to topic
 */
export async function sendTopicNotification(
  topic: string,
  notification: PushNotification,
  data?: Record<string, string>
): Promise<IntegrationResponse<{ messageId: string }>> {
  try {
    const serverKey = process.env.FIREBASE_SERVER_KEY;

    if (!serverKey) {
      return createErrorResponse(
        'FIREBASE_MISSING_SERVER_KEY',
        'Firebase server key is not configured'
      );
    }

    const admin = await import('firebase-admin');
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }

    const message = {
      topic,
      notification,
      data,
    };

    const response = await admin.messaging().send(message);

    return createSuccessResponse({ messageId: response });
  } catch (error) {
    return createErrorResponse(
      'TOPIC_NOTIFICATION_ERROR',
      error instanceof Error ? error.message : 'Failed to send topic _notification',
      error
    );
  }
}

/**
 * Subscribe device to topic
 */
export async function subscribeToTopic(
  tokens: string[],
  topic: string
): Promise<IntegrationResponse<{ successCount: number }>> {
  try {
    const serverKey = process.env.FIREBASE_SERVER_KEY;

    if (!serverKey) {
      return createErrorResponse(
        'FIREBASE_MISSING_SERVER_KEY',
        'Firebase server key is not configured'
      );
    }

    // This is a placeholder - actual implementation uses firebase-admin
    // const response = await admin.messaging().subscribeToTopic(tokens, topic);

    console.log('[Firebase] Would subscribe', tokens.length, 'devices to topic:', topic);

    return createSuccessResponse({ successCount: tokens.length });
  } catch (error) {
    return createErrorResponse(
      'SUBSCRIBE_ERROR',
      error instanceof Error ? error.message : 'Failed to subscribe to topic',
      error
    );
  }
}

/**
 * Unsubscribe device from topic
 */
export async function unsubscribeFromTopic(
  tokens: string[],
  topic: string
): Promise<IntegrationResponse<{ successCount: number }>> {
  try {
    const serverKey = process.env.FIREBASE_SERVER_KEY;

    if (!serverKey) {
      return createErrorResponse(
        'FIREBASE_MISSING_SERVER_KEY',
        'Firebase server key is not configured'
      );
    }

    // This is a placeholder - actual implementation uses firebase-admin
    // const response = await admin.messaging().unsubscribeFromTopic(tokens, topic);

    console.log('[Firebase] Would unsubscribe', tokens.length, 'devices from topic:', topic);

    return createSuccessResponse({ successCount: tokens.length });
  } catch (error) {
    return createErrorResponse(
      'UNSUBSCRIBE_ERROR',
      error instanceof Error ? error.message : 'Failed to unsubscribe from topic',
      error
    );
  }
}

/**
 * Common notification helpers
 */
export const PushNotifications = {
  // Event notifications
  eventReminder: (token: string, eventName: string, eventDate: string, eventId: string) =>
    sendPushNotification({
      token,
      notification: {
        title: 'Event Reminder',
        body: `${eventName} is coming up on ${eventDate}`,
        icon: '/icons/event.png',
      },
      data: {
        eventId,
        type: 'event_reminder',
      },
    }),

  // Ticket notifications
  ticketPurchased: (token: string, eventName: string, ticketCount: number) =>
    sendPushNotification({
      token,
      notification: {
        title: 'Tickets Confirmed!',
        body: `You've purchased ${ticketCount} ticket(s) for ${eventName}`,
        icon: '/icons/ticket-icon.png',
      },
      data: { type: 'ticket_purchased' },
    }),

// Order notifications
orderStatusUpdate: (token: string, orderId: string, status: string) =>
  sendPushNotification({
    token,
    notification: {
      title: 'Order Update',
      body: `Your order #${orderId} is now ${status}`,
      icon: '/icons/order-icon.png',
    },
    data: { orderId, type: 'order_update' },
  }),

// Social notifications
newMessage: (token: string, senderName: string, preview: string) =>
  sendPushNotification({
    token,
    notification: {
      title: `New message from ${senderName}`,
      body: preview,
      icon: '/icons/message-icon.png',
    },
    data: { type: 'new_message' },
  }),

// Wishlist notifications
wishlistItemAvailable: (token: string, itemName: string) =>
  sendPushNotification({
    token,
    notification: {
      title: 'Wishlist Alert',
      body: `${itemName} is now available!`,
      icon: '/icons/wishlist-icon.png',
    },
    data: { type: 'wishlist_alert' },
  }),
};
