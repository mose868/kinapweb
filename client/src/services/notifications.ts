import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '../config/firebase';

type NotificationType = 'message' | 'order' | 'review' | 'payment' | 'system';

interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export const createNotification = async (data: NotificationData) => {
  try {
    const notificationRef = collection(db, COLLECTIONS.NOTIFICATIONS);
    await addDoc(notificationRef, {
      ...data,
      isRead: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const createOrderNotification = async (
  userId: string,
  orderId: string,
  type: 'new' | 'update' | 'delivery' | 'complete'
) => {
  let title = '';
  let message = '';

  switch (type) {
    case 'new':
      title = 'New Order Received';
      message = 'You have received a new order. Click to view details.';
      break;
    case 'update':
      title = 'Order Status Updated';
      message = 'Your order status has been updated. Click to view details.';
      break;
    case 'delivery':
      title = 'Order Delivered';
      message = 'Your order has been delivered. Please review and accept the delivery.';
      break;
    case 'complete':
      title = 'Order Completed';
      message = 'Your order has been completed. Thank you for using our service.';
      break;
  }

  await createNotification({
    userId,
    type: 'order',
    title,
    message,
    link: `/orders/${orderId}`
  });
};

export const createMessageNotification = async (
  userId: string,
  orderId: string,
  senderName: string
) => {
  await createNotification({
    userId,
    type: 'message',
    title: 'New Message',
    message: `You have a new message from ${senderName}`,
    link: `/orders/${orderId}`
  });
};

export const createReviewNotification = async (
  userId: string,
  gigId: string,
  reviewerName: string
) => {
  await createNotification({
    userId,
    type: 'review',
    title: 'New Review',
    message: `${reviewerName} has left a review on your gig`,
    link: `/gigs/${gigId}`
  });
};

export const createPaymentNotification = async (
  userId: string,
  orderId: string,
  type: 'received' | 'released' | 'refunded'
) => {
  let title = '';
  let message = '';

  switch (type) {
    case 'received':
      title = 'Payment Received';
      message = 'Payment has been received for your order.';
      break;
    case 'released':
      title = 'Payment Released';
      message = 'Payment has been released to your account.';
      break;
    case 'refunded':
      title = 'Payment Refunded';
      message = 'Payment has been refunded to the buyer.';
      break;
  }

  await createNotification({
    userId,
    type: 'payment',
    title,
    message,
    link: `/orders/${orderId}`
  });
};

export const createSystemNotification = async (
  userId: string,
  title: string,
  message: string,
  link?: string
) => {
  await createNotification({
    userId,
    type: 'system',
    title,
    message,
    link
  });
}; 