import React from 'react';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  TextInput,
  Button,
  Image,
} from 'react-native';
import {
  InitConfiguration,
  YandexPay,
  YandexPayCheckoutButton,
  CurrencyCode,
} from '@yandex-pay/react-native-sdk';

const LOGO_URL = 'https://yastatic.net/s3/pay-static/icons/yandex-pay.png';

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

function text2json<T = Record<string, string>>(text: string): null | T {
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
    () => text2json<InitConfiguration>(initialDataText),
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

    if (!initialData) {
      setInitialStatus('Invalid initial data');
      return;
    }

    YandexPay.initialize(initialData).then(
      () => setInitialStatus('success'),
      (err: any) => setInitialStatus(err.toString())
    );
  }, [stage, initialData, setInitialStatus]);

  if (stage === 'edit') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.containerLogo}>
          <Image style={styles.logo} source={{ uri: LOGO_URL }} />
        </View>
        <View style={styles.containerMain}>
          <Text style={styles.fieldLabel}>Initialize data</Text>
          <TextInput
            multiline
            style={{ ...styles.fieldInput, height: 130 }}
            onChangeText={(text) => setInitialDataText(text)}
            value={initialDataText}
          />
          <Text style={styles.fieldLabel}>
            {initialData ? '' : 'Invalid initialize data'}
          </Text>
          <Text style={styles.fieldLabel}>Payment sheet</Text>
          <TextInput
            multiline
            style={{ ...styles.fieldInput, height: 300 }}
            onChangeText={(text) => setPaymentSheetText(text)}
            value={paymentSheetText}
          />
          <Text style={styles.fieldLabel}>
            {paymentSheet ? '' : 'Invalid payment sheet'}
          </Text>

          <Button
            title="Show Yandex Pay"
            disabled={!(paymentSheet && initialData)}
            onPress={() => setStage('yandex-pay')}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.containerLogo}>
        <Image style={styles.logo} source={{ uri: LOGO_URL }} />
      </View>
      <View style={styles.containerMain}>
        <View style={styles.containerButton}>
          <Text style={styles.status}>Initialization: {initialStatus}</Text>
          {initialStatus === 'success' && (
            <YandexPayCheckoutButton
              theme="dark"
              paymentSheet={paymentSheet}
              onCheckoutSuccess={(result: any) => {
                Alert.alert(
                  'Success!',
                  `Checkout finished successfully - <${JSON.stringify(result)}>`
                );
              }}
              onCheckoutAbort={() => {
                Alert.alert(
                  'Cancelled!',
                  'Checkout has been cancelled by user'
                );
              }}
              onCheckoutError={(error: any) => {
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  containerLogo: {
    marginTop: 50,
    marginBottom: 20,
    height: 50,
    alignItems: 'center',
  },
  logo: {
    width: 123,
    height: 50,
    marginBottom: 20,
  },
  containerMain: {
    flex: 1,
  },
  fieldLabel: {
    fontWeight: '500',
  },
  fieldInput: {
    height: 100,
    margin: 0,
    borderWidth: 1,
    padding: 5,
  },
  fieldError: {
    marginBottom: 10,
    color: 'red',
  },
  containerButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  status: {
    marginBottom: 10,
  },
  button: {
    width: 300,
    height: YandexPayCheckoutButton.Constants.DefaultHeight,
  },
});
