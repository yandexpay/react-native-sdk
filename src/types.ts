/**
 * Информация о продавце
 */
export interface Merchant {
  // ID продавца.
  id: string;
  // Имя продавца (отображается на платежной форме).
  name: string;
  // Url продавца.
  url: string;
}

/**
 * Окружение в котором совершается платеж
 */
export enum PaymentEnv {
  Production = 'PRODUCTION',
  Sandbox = 'SANDBOX',
}

/**
 * Язык формы
 */
export type Language = 'ru' | 'en' | 'system';

/**
 * Конфигурация инициализации сдк
 */
export interface InitConfiguration {
  // Информация о продавце.
  merchant: Merchant;
  // По умолчанию - 'PRODUCTION'
  env?: PaymentEnv;
  // По умолчанию - 'system'
  lang?: Language;
}

export interface ButtonConstants {
  // Высота кнопки по умолчанию
  DefaultHeight: number;
}

/**
 * Тема кнопки YandexPay
 */
export type ButtonTheme = 'dark' | 'light' | 'system';

/**
 * Код валюты по стандарту ISO 4217.
 */
 export enum CurrencyCode {
  Rub = 'RUB',
  Byn = 'BYN',
  Usd = 'USD',
  Eur = 'EUR',
  Kzt = 'KZT',
  Uah = 'UAH',
  Amd = 'AMD',
  Gel = 'GEL',
  Azn = 'AZN',
  Kgs = 'KGS',
  Gbp = 'GBP',
  Sek = 'SEK',
  Pln = 'PLN',
  Inr = 'INR',
  Czk = 'CZK',
  Cad = 'CAD',
  Brl = 'BRL',
  Aud = 'AUD',
  Uzs = 'UZS',  
 }

// Должно быть больше 0 и не содержать больше двух знаков после запятой.
// Например 1.12, 5.1, 10.
export type Price = string;
export type Count = string;

interface PaymentCart {
  items: Array<{
      productId: string;
      total: Price;
      quantity?: { count: Count };
  }>;
}

// Информация о корзине покупателя
export interface PaymentSheet {
  currencyCode: CurrencyCode;
  cart: PaymentCart;
  orderId?: string;
  metadata?: string;
}

export interface CheckoutInfo {
  orderId: string
  metadata?: string;
}

export interface CheckoutError {
  reason?: string;
}
