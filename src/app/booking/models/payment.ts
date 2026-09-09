export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface ProcessPaymentRequest {
  success: boolean;
}

export interface PaymentResult {
  paymentId: number;
  status: PaymentStatus;
}