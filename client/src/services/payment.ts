// Platform fee percentage
const PLATFORM_FEE_PERCENTAGE = 0.10; // 10%

// Calculate platform fee and net amount
const calculateFees = (amount: number) => {
  const platformFee = amount * PLATFORM_FEE_PERCENTAGE;
  const netAmount = amount - platformFee;
  return { platformFee, netAmount };
};

// Placeholder for M-Pesa API integration
export const sendMpesaCommission = async (amount: number, phoneNumber: string): Promise<void> => {
  // TODO: Integrate with M-Pesa API (e.g., Safaricom Daraja, Flutterwave, etc.)
  // Use environment variables for credentials
  // Log the transaction for audit
  console.log(`Sending KES ${amount} commission to club M-Pesa number ${phoneNumber}`);
  // Example: await mpesaApi.sendMoney({ amount, phoneNumber });
};

// Initialize payment and create escrow
export const initializePayment = async (
  orderId: string,
  amount: number,
  buyerId: string,
  paymentMethod: string,
  billingDetails: PaymentDetails['billingDetails']
): Promise<PaymentDetails> => {
  try {
    // Calculate fees
    const { platformFee, netAmount } = calculateFees(amount);

    // Send commission to club M-Pesa
    await sendMpesaCommission(platformFee, '0792343958');

    // Create payment record
    const paymentData: Omit<PaymentDetails, 'id'> = {
      orderId,
      amount,
      platformFee,
      netAmount,
      currency: 'KES',
      paymentMethod,
      paymentMethodDetails: {
        type: paymentMethod,
        // Add other details based on payment method
      },
      billingDetails,
      status: 'pending',
      escrowDetails: {
        holdPeriod: 14, // 14 days hold period
        releaseTrigger: 'manual'
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add payment record to database
    const paymentRef = await addDoc(collection(db, COLLECTIONS.PAYMENTS), paymentData);
    
    // Create escrow transaction
    const escrowData: Omit<EscrowTransaction, 'id'> = {
      paymentId: paymentRef.id,
      orderId,
      amount: netAmount,
      status: 'held',
      holdStartDate: serverTimestamp(),
      releasedTo: '', // Will be set when released
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await addDoc(collection(db, COLLECTIONS.ESCROW), escrowData);

    // Update order status
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderRef, {
      paymentStatus: 'paid',
      updatedAt: serverTimestamp()
    });

    return {
      id: paymentRef.id,
      ...paymentData
    };
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw new Error('Failed to initialize payment');
  }
};

// Release funds from escrow to seller
export const releaseFundsToSeller = async (
  orderId: string,
  sellerId: string
): Promise<void> => {
  try {
    // Get escrow transaction
    const escrowQuery = query(
      collection(db, COLLECTIONS.ESCROW),
      where('orderId', '==', orderId)
    );
    const escrowSnapshot = await getDoc(doc(db, COLLECTIONS.ESCROW, escrowQuery));
    
    if (!escrowSnapshot.exists()) {
      throw new Error('Escrow transaction not found');
    }

    const escrowData = escrowSnapshot.data() as EscrowTransaction;

    // Update escrow status
    await updateDoc(doc(db, COLLECTIONS.ESCROW, escrowSnapshot.id), {
      status: 'released',
      releasedTo: sellerId,
      releaseDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update payment status
    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, escrowData.paymentId);
    await updateDoc(paymentRef, {
      status: 'released',
      'escrowDetails.releaseDate': serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update order status
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderRef, {
      status: 'completed',
      completedDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error releasing funds:', error);
    throw new Error('Failed to release funds');
  }
};

// Initiate refund process
export const initiateRefund = async (
  orderId: string,
  reason: string
): Promise<void> => {
  try {
    // Get escrow transaction
    const escrowQuery = query(
      collection(db, COLLECTIONS.ESCROW),
      where('orderId', '==', orderId)
    );
    const escrowSnapshot = await getDoc(doc(db, COLLECTIONS.ESCROW, escrowQuery));
    
    if (!escrowSnapshot.exists()) {
      throw new Error('Escrow transaction not found');
    }

    // Update escrow status
    await updateDoc(doc(db, COLLECTIONS.ESCROW, escrowSnapshot.id), {
      status: 'refunded',
      updatedAt: serverTimestamp()
    });

    // Update payment status
    const escrowData = escrowSnapshot.data() as EscrowTransaction;
    const paymentRef = doc(db, COLLECTIONS.PAYMENTS, escrowData.paymentId);
    await updateDoc(paymentRef, {
      status: 'refunded',
      updatedAt: serverTimestamp()
    });

    // Update order status
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderRef, {
      status: 'cancelled',
      paymentStatus: 'refunded',
      cancelledDate: serverTimestamp(),
      cancellationReason: reason,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error initiating refund:', error);
    throw new Error('Failed to initiate refund');
  }
};

// Save payment method for user
export const savePaymentMethod = async (
  userId: string,
  paymentMethodData: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>
): Promise<PaymentMethod> => {
  try {
    const paymentMethodDoc = await addDoc(collection(db, COLLECTIONS.PAYMENT_METHODS), {
      ...paymentMethodData,
      userId,
      createdAt: serverTimestamp()
    });

    return {
      id: paymentMethodDoc.id,
      userId,
      ...paymentMethodData,
      createdAt: serverTimestamp()
    };
  } catch (error) {
    console.error('Error saving payment method:', error);
    throw new Error('Failed to save payment method');
  }
};

// Get user's saved payment methods
export const getUserPaymentMethods = async (
  userId: string
): Promise<PaymentMethod[]> => {
  try {
    const paymentMethodsQuery = query(
      collection(db, COLLECTIONS.PAYMENT_METHODS),
      where('userId', '==', userId)
    );
    const snapshot = await getDoc(doc(db, COLLECTIONS.PAYMENT_METHODS, paymentMethodsQuery));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PaymentMethod));
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw new Error('Failed to get payment methods');
  }
};

// Generate payment analytics for a user
export const generatePaymentAnalytics = async (
  userId: string,
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
): Promise<PaymentAnalytics> => {
  try {
    // Get all user transactions within the period
    const startDate = getStartDateForPeriod(period);
    const transactions = await getTransactionsForPeriod(userId, startDate);
    
    // Calculate metrics
    const metrics = calculateMetrics(transactions);
    
    // Create or update analytics record
    const analyticsData: Omit<PaymentAnalytics, 'id'> = {
      userId,
      period,
      metrics,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const analyticsRef = await addDoc(collection(db, COLLECTIONS.PAYMENT_ANALYTICS), analyticsData);
    
    return {
      id: analyticsRef.id,
      ...analyticsData
    };
  } catch (error) {
    console.error('Error generating payment analytics:', error);
    throw new Error('Failed to generate payment analytics');
  }
};

// Request withdrawal
export const requestWithdrawal = async (
  userId: string,
  amount: number,
  paymentMethodId: string
): Promise<WithdrawalRequest> => {
  try {
    // Get user's payment method
    const paymentMethodRef = doc(db, COLLECTIONS.PAYMENT_METHODS, paymentMethodId);
    const paymentMethodSnap = await getDoc(paymentMethodRef);
    
    if (!paymentMethodSnap.exists()) {
      throw new Error('Payment method not found');
    }

    const paymentMethod = paymentMethodSnap.data() as PaymentMethod;
    
    // Calculate fees
    const transactionFee = calculateWithdrawalFee(amount);
    const netAmount = amount - transactionFee;

    // Create withdrawal request
    const withdrawalData: Omit<WithdrawalRequest, 'id'> = {
      userId,
      amount,
      paymentMethod,
      status: 'pending',
      processingTime: estimateProcessingTime(paymentMethod.type),
      estimatedArrival: calculateEstimatedArrival(paymentMethod.type),
      transactionFee,
      netAmount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const withdrawalRef = await addDoc(collection(db, COLLECTIONS.WITHDRAWALS), withdrawalData);
    
    return {
      id: withdrawalRef.id,
      ...withdrawalData
    };
  } catch (error) {
    console.error('Error requesting withdrawal:', error);
    throw new Error('Failed to request withdrawal');
  }
};

// Configure automatic payouts
export const configureAutomaticPayouts = async (
  userId: string,
  settings: Omit<AutomaticPayoutSettings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<AutomaticPayoutSettings> => {
  try {
    // Validate payment method
    const paymentMethodRef = doc(db, COLLECTIONS.PAYMENT_METHODS, settings.preferredPaymentMethod);
    const paymentMethodSnap = await getDoc(paymentMethodRef);
    
    if (!paymentMethodSnap.exists()) {
      throw new Error('Payment method not found');
    }

    // Calculate next payout date
    const nextPayout = calculateNextPayoutDate(settings.frequency);

    const payoutSettings: Omit<AutomaticPayoutSettings, 'id'> = {
      userId,
      ...settings,
      nextScheduledPayout: nextPayout,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const settingsRef = await addDoc(collection(db, COLLECTIONS.PAYOUT_SETTINGS), payoutSettings);
    
    return {
      id: settingsRef.id,
      ...payoutSettings
    };
  } catch (error) {
    console.error('Error configuring automatic payouts:', error);
    throw new Error('Failed to configure automatic payouts');
  }
};

// Create milestone payment
export const createMilestonePayment = async (
  orderId: string,
  milestoneData: Omit<MilestonePayment, 'id' | 'orderId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<MilestonePayment> => {
  try {
    // Get order details
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      throw new Error('Order not found');
    }

    const milestone: Omit<MilestonePayment, 'id'> = {
      orderId,
      ...milestoneData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const milestoneRef = await addDoc(collection(db, COLLECTIONS.MILESTONES), milestone);
    
    return {
      id: milestoneRef.id,
      ...milestone
    };
  } catch (error) {
    console.error('Error creating milestone payment:', error);
    throw new Error('Failed to create milestone payment');
  }
};

// Fund milestone
export const fundMilestone = async (milestoneId: string): Promise<void> => {
  try {
    const milestoneRef = doc(db, COLLECTIONS.MILESTONES, milestoneId);
    const milestoneSnap = await getDoc(milestoneRef);
    
    if (!milestoneSnap.exists()) {
      throw new Error('Milestone not found');
    }

    const milestone = milestoneSnap.data() as MilestonePayment;

    // Create escrow transaction for milestone
    const escrowData: Omit<EscrowTransaction, 'id'> = {
      paymentId: '', // Will be set after payment
      orderId: milestone.orderId,
      amount: milestone.amount,
      status: 'held',
      holdStartDate: serverTimestamp(),
      releasedTo: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const escrowRef = await addDoc(collection(db, COLLECTIONS.ESCROW), escrowData);

    // Update milestone with escrow reference
    await updateDoc(milestoneRef, {
      status: 'funded',
      escrowTransactionId: escrowRef.id,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error funding milestone:', error);
    throw new Error('Failed to fund milestone');
  }
};

// Release milestone payment
export const releaseMilestonePayment = async (
  milestoneId: string,
  sellerId: string
): Promise<void> => {
  try {
    const milestoneRef = doc(db, COLLECTIONS.MILESTONES, milestoneId);
    const milestoneSnap = await getDoc(milestoneRef);
    
    if (!milestoneSnap.exists()) {
      throw new Error('Milestone not found');
    }

    const milestone = milestoneSnap.data() as MilestonePayment;

    if (!milestone.escrowTransactionId) {
      throw new Error('Milestone not funded');
    }

    // Release escrow
    const escrowRef = doc(db, COLLECTIONS.ESCROW, milestone.escrowTransactionId);
    await updateDoc(escrowRef, {
      status: 'released',
      releasedTo: sellerId,
      releaseDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update milestone status
    await updateDoc(milestoneRef, {
      status: 'released',
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error releasing milestone payment:', error);
    throw new Error('Failed to release milestone payment');
  }
};

// Helper functions
const getStartDateForPeriod = (period: string): Date => {
  const now = new Date();
  switch (period) {
    case 'daily':
      return new Date(now.setHours(0, 0, 0, 0));
    case 'weekly':
      return new Date(now.setDate(now.getDate() - 7));
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'yearly':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return now;
  }
};

const calculateWithdrawalFee = (amount: number): number => {
  // Implement your fee calculation logic
  return Math.max(50, amount * 0.01); // Minimum 50 KES or 1%
};

const estimateProcessingTime = (paymentMethodType: string): number => {
  switch (paymentMethodType) {
    case 'mpesa':
      return 1; // 1 hour
    case 'bank':
      return 48; // 48 hours
    default:
      return 24; // 24 hours
  }
};

const calculateEstimatedArrival = (paymentMethodType: string): Timestamp => {
  const processingTime = estimateProcessingTime(paymentMethodType);
  const estimatedDate = new Date();
  estimatedDate.setHours(estimatedDate.getHours() + processingTime);
  return Timestamp.fromDate(estimatedDate);
};

const calculateNextPayoutDate = (frequency: string): Timestamp => {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
  }
  return Timestamp.fromDate(now);
}; 