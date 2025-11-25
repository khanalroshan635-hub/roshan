export interface Service {
  id: string;
  category: string;
  name: string;
  rate: number; // Price per 1000
  min: number;
  max: number;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  role: 'user' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  username: string;
  serviceId: string;
  serviceName: string;
  link: string;
  quantity: number;
  charge: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Canceled';
  date: string;
  refillStatus?: 'None' | 'Pending' | 'Completed';
  dripFeed?: {
    runs: number;
    interval: number; // in minutes
    totalQuantity: number;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  username: string;
  amount: number;
  method: 'eSewa' | 'Khalti';
  transactionId: string; // The ID user enters from their app
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface Ticket {
  id: string;
  userId: string;
  username: string;
  subject: string;
  message: string;
  status: 'Open' | 'Answered' | 'Closed';
  date: string;
  type: 'Order' | 'Payment' | 'Other';
  orderId?: string;
  responses?: { sender: string; message: string; date: string }[];
}

export enum PageState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  DASHBOARD = 'DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}