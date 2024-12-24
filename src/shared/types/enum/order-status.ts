export enum PaymentType {
  cash = 'cash',
  bankTransfer = 'bankTransfer',
  mercadopago = 'mercadopago',
}

export enum DeliveryType {
  pickUpInStore = 'pickUpInStore',
  shipping = 'shipping',
}

export enum PaymentStatus {
  noPay = 'noPay',
  pendingToPay = 'pendingToPay',
  paid = 'paid',
}

export enum ShippingStatus {
  toPack = 'toPack',
  toSend = 'toSend',
  sent = 'sent',
  delivered = 'delivered',
}

export enum DeliveryStatus {
  toPack = 'toPack',
  readyToPickUp = 'readyToPickUp',
  delivered = 'delivered',
}
