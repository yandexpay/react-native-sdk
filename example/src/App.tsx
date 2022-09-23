import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  Button,
  Image,
} from 'react-native';
import {
  YandexPay,
  YandexPayCheckoutButton,
  CurrencyCode,
} from '@yandex-pay/react-native-sdk';

const LOGO_URL = 'https://yastatic.net/s3/pay-static/icons/yandex-pay.svg';

const DEFAULT_INITIAL_DATA = `{
  "merchant": {
    "id": "id",
    "name": "name",
    "url": ""
  }
}`;

const DEFAULT_PAYMENT_SHEET = `{
  "currencyCode": "${CurrencyCode.Rub}",
  "cart": {
    "items": [
      {
        "id": "id",
        "total": "total",
        "quantity": {
          "count": "1"
        }
      }
    ]
  },
  "orderId": "orderId",
  "metadata": "metadata"
}`;

function text2json(text: string): any | null {
  try {
    const data = JSON.parse(text);

    return data && typeof data === 'object' ? data : null;
  } catch (_) {
    return null;
  }
}

export default function App() {
  const [stage, setStage] = React.useState('edit');

  const [initialDataText, setInitialDataText] =
    React.useState(DEFAULT_INITIAL_DATA);
  const [paymentSheetText, setPaymentSheetText] = React.useState(
    DEFAULT_PAYMENT_SHEET
  );

  const [initialStatus, setInitialStatus] = React.useState('');

  const initialData = React.useMemo(
    () => text2json(initialDataText),
    [initialDataText]
  );
  const paymentSheet = React.useMemo(
    () => text2json(paymentSheetText),
    [paymentSheetText]
  );

  React.useEffect(() => {
    if (stage !== 'yandex-pay') {
      setInitialStatus('');
      return;
    }

    YandexPay.initialize(initialData).then(
      () => setInitialStatus('success'),
      (err) => setInitialStatus(err.toString())
    );
  }, [stage, initialData, setInitialStatus]);

  if (stage === 'edit') {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <Image style={styles.logo} source={LOGO_URL} />
        </View>
        <Text style={styles.label}>Initialize data</Text>
        <TextInput
          multiline
          style={{ ...styles.input, height: 130 }}
          onChangeText={(text) => setInitialDataText(text)}
          value={initialDataText}
        />
        <Text style={styles.inputError}>
          {initialData ? '' : 'Invalid initialize data'}
        </Text>
        <Text style={styles.label}>Payment sheet</Text>
        <TextInput
          multiline
          style={{ ...styles.input, height: 300 }}
          onChangeText={(text) => setPaymentSheetText(text)}
          value={paymentSheetText}
        />
        <Text style={styles.inputError}>
          {paymentSheet ? '' : 'Invalid payment sheet'}
        </Text>

        <Button
          title="Show Yandex Pay"
          disabled={!(paymentSheet && initialData)}
          onPress={() => setStage('yandex-pay')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerCenter}>
        <Image style={styles.logo} source={LOGO_URL} />
      </View>
      <Text style={{ marginVertical: 20 }}>
        Initialization: {initialStatus}
      </Text>
      <View style={styles.containerYandexPay}>
        {initialStatus === 'success' && (
          <YandexPayCheckoutButton
            theme="dark"
            paymentSheet={paymentSheet}
            onCheckoutSuccess={(result) => {
              Alert.alert(
                'Success!',
                `Checkout finished successfully - <${JSON.stringify(result)}>`
              );
            }}
            onCheckoutAbort={() => {
              Alert.alert('Cancelled!', 'Checkout has been cancelled by user');
            }}
            onCheckoutError={(error) => {
              Alert.alert(
                'Error!',
                `Checkout finished with error - <${JSON.stringify(error)}>`
              );
            }}
            style={styles.button}
          />
        )}
      </View>

      <Button title="Back to edit" onPress={() => setStage('edit')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: '20px',
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 123,
    height: 42,
    marginBottom: 20,
  },
  label: {
    fontWeight: '500',
  },
  input: {
    height: 100,
    margin: 0,
    borderWidth: 1,
    padding: 5,
  },
  inputError: {
    marginBottom: 10,
    color: 'red',
  },
  containerYandexPay: {
    marginBottom: 20,
  },
  button: {
    width: 300,
    height: YandexPayCheckoutButton.Constants.DefaultHeight,
  },
});
