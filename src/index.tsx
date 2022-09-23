import * as React from 'react';
import { NativeModules, Platform, requireNativeComponent, UIManager } from 'react-native';
import PropTypes from 'prop-types';
import { ButtonConstants, ButtonTheme, CheckoutError, CheckoutInfo, InitConfiguration, PaymentEnv } from './types';

export * from './types';

const LINKING_ERROR =
  `The package '@yandex-pay/react-native-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const YandexPayNativeModule = NativeModules.YandexPay  ? NativeModules.YandexPay  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class YandexPay {
  private static _initializePromise?: Promise<void>

  public static initialize(config: InitConfiguration): Promise<void> {
    if (YandexPay._initializePromise) {
      return YandexPay._initializePromise!
    }

    YandexPay._initializePromise = YandexPayNativeModule.initialize({
      'merchant': {
        'id': config.merchant.id,
        'name': config.merchant.name,
        'url': config.merchant.url,
      },
      'env': config.env ?? PaymentEnv.Production,
      'lang': config.lang ?? 'system',
    });
    return YandexPay._initializePromise!
  }
}

export interface YandexPayCheckoutButtonProps {
  theme?: ButtonTheme;
  paymentSheet?: any;
  onCheckoutSuccess?: (result: CheckoutInfo) => void;
  onCheckoutAbort?: () => void;
  onCheckoutError?: (error: CheckoutError) => void
}

export class YandexPayCheckoutButton<P> extends React.Component<P & YandexPayCheckoutButtonProps> {
  public static Constants: ButtonConstants = (UIManager as any).YandexPayCheckoutButton.Constants;

  _onCheckoutSuccess = (event: any) => {
    this.props.onCheckoutSuccess?.(event.nativeEvent);
  };

  _onCheckoutAbort = (_: any) => {
    this.props.onCheckoutAbort?.();
  };

  _onCheckoutError = (event: any) => {
    this.props.onCheckoutError?.(event.nativeEvent);
  };

  render() {
    return (
      <NativeYandexPayCheckoutButton
        {...this.props}
        onCheckoutSuccess={this._onCheckoutSuccess}
        onCheckoutAbort={this._onCheckoutAbort}
        onCheckoutError={this._onCheckoutError}
      />
    );
  }
}

const NativeYandexPayCheckoutButton = requireNativeComponent('YandexPayCheckoutButton');

(YandexPayCheckoutButton as any).propTypes = {
  theme: PropTypes.oneOf(['dark', 'light', 'system']),
  paymentSheet: PropTypes.exact({
    currencyCode: PropTypes.oneOf(['RUB', 'BYN', 'USD', 'EUR', 'KZT', 'UAH', 'AMD', 'GEL', 'AZN', 'KGS', 'GBP', 'SEK', 'PLN', 'INR', 'CZK', 'CAD', 'BRL', 'AUD', 'UZS']).isRequired,
    cart: PropTypes.exact({
      items: PropTypes.arrayOf(
        PropTypes.exact({
          id: PropTypes.string.isRequired,
          total: PropTypes.string.isRequired,
          quantity: PropTypes.exact({
            count: PropTypes.string.isRequired,
          }),
        }),
      ).isRequired
    }).isRequired,
    orderId: PropTypes.string,
    metadata: PropTypes.string,
  }),
  onCheckoutSuccess: PropTypes.func,
  onCheckoutAbort: PropTypes.func,
  onCheckoutError: PropTypes.func,
};
