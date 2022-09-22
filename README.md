# react-native-yandex-pay

## Установка

```sh
npm install react-native-yandex-pay
```

### iOS

* Настройте YandexLoginSDK согласно [инструкции](https://yandex.ru/dev/mobileauthsdk/doc/sdk/concepts/ios/2.0.0/sdk-ios-install.html)
* Добавьте следующие вызовы в свой файл `AppDelegate.mm`:

```objc

#import <YandexPaySDK/YandexPaySDK-Swift.h>

// [...]

#pragma mark - YandexPay

- (void)application:(UIApplication *)application didUpdateUserActivity:(NSUserActivity *)userActivity {
  if (YandexPaySDKApi.isInitialized) {
    [[YandexPaySDKApi instance] applicationDidReceiveUserActivity:userActivity];
  }
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if (YandexPaySDKApi.isInitialized) {
    [[YandexPaySDKApi instance] applicationDidReceiveOpen:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]];
  }
  return YES;
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
  if (YandexPaySDKApi.isInitialized) {
    [[YandexPaySDKApi instance] applicationWillEnterForeground];
  }
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  if (YandexPaySDKApi.isInitialized) {
    [[YandexPaySDKApi instance] applicationDidBecomeActive];
  }
}

```

## Использование

### Инициализация СДК :

```js
import { YandexPay } from 'react-native-yandex-pay';

// Убедитесь, что сдк YandexPay инициализирована только один раз за время жизни приложения
export default function App() {
  const [result, setResult] = React.useState<string | undefined>();

  React.useEffect(() => {
    YandexPay.initialize({
      merchant: {
        id: 'id',
        name: 'name',
        url: ''
      }
    }).then(() => setResult('success'), (err) => setResult(err.toString()))
  }, []);

  // [...]
}
```

### Установка кнопки YandexPay:

```js
import { YandexPayCheckoutButton, CurrencyCode } from 'react-native-yandex-pay';

const paymentSheet = {
  currencyCode: CurrencyCode.Rub,
  cart: {
      items: [
          {
              id: 'id',
              total: 'total',
              quantity: {
                  count: '1',
              },
          },
      ],
  },
  orderId: 'order-id',
  metadata: 'metadata',
}

return <YandexPayCheckoutButton 
  theme='dark'
  paymentSheet={paymentSheet}
  onCheckoutSuccess={(result) => {
    Alert.alert('Success!', `Checkout finished successfully - <${JSON.stringify(result)}>`)
  }}
  onCheckoutAbort={() => {
    Alert.alert('Cancelled!', 'Checkout has been cancelled by user')
  }}
  onCheckoutError={(error) => {
    Alert.alert('Error!', `Checkout finished with error - <${JSON.stringify(error)}>`)
  }}
  style={styles.button}
/>

// [...]

const styles = StyleSheet.create({
  button: {
    width: 300,
    height: YandexPayCheckoutButton.Constants.DefaultHeight
  }
});

```

## Лицензия

PROPRIETARY

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
