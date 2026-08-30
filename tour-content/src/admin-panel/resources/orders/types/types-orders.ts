export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';

export interface OrderItem {
  id: number;
  tourId: number;
  productName: string;        
  quantity: number;         
  unitPrice: number;         
  totalPrice: number;         
  tourDate?: string | Date;          
}

export interface OrdersLabel {
id: number,
items: OrderItem[],
customerName: string,
customerEmail: string,
customerPhone: string,
totalPrice: number,
orderStatus: OrderStatus,
creteAt: string | Date;
}