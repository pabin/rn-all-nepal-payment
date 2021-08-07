import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Modal,
  SafeAreaView
} from 'react-native';

import CloseIcon from './../common/Close';
import { styles } from './../common/styles';
import EsewaPayment from './../common/Webview';
import { sourceGenerator } from './helpers/htmlGenerator';

 const EsewaSdk = props => {
  const [url, setUrl] = React.useState('');
  const { successURL, faliureURL,onPaymentComplete } = props;

  React.useEffect(() => {
    _handlePaymetProcess();
    return
  }, [url]);

  const _handlePaymetProcess = () => {
    try {

      if (url === faliureURL) {
        return onPaymentComplete({
          message: `Sorry, your payment process could not be completed`
        });

      } else if (url.startsWith(successURL)) {

        const splits = url.split('&');
        const ref = splits[splits.length - 1].split('=');
        const amt = splits[splits.length - 2].split('=');
        let data = { token: ref[1], amount: Math.round(amt[1]) };
        return onPaymentComplete(data);

      }

    } catch (err) {
      return onPaymentComplete({
        message: `Sorry, your payment process could not be completed`
      });
    }
  }

  const _onClose = () => 
    onPaymentComplete({
      message: `Payment process interrupted`
    });

  const _onNavigationStateChange = (state) =>
    setUrl(state.url)

  return (
    <Modal
    animationType={'slide'}
    visible={props.isVisible}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaView}>
         <CloseIcon 
         onClose={_onClose}
         />
          <EsewaPayment
            source={{
              html: sourceGenerator({
                amt: props.amt,
                psc: props.psc,
                pdc: props.pdc,
                pid: props.pid,
                env: props.env,
                taxAmt: props.taxAmt,
                successURL:successURL,
                faliureURL:faliureURL,
                totalAmt: props.totalAmt,
              })
            }}
            onNavigationStateChange={_onNavigationStateChange}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default EsewaSdk;
EsewaSdk.propTypes = {
  amt: PropTypes.number.isRequired,
  psc: PropTypes.number.isRequired,
  pdc: PropTypes.number.isRequired,
  pid: PropTypes.number.isRequired,
  env: PropTypes.string.isRequired,
  taxAmt:PropTypes.number.isRequired,
  totalAmt: PropTypes.number.isRequired,
  successURL:PropTypes.string.isRequired,
  faliureURL :PropTypes.string.isRequired,
  onPaymentComplete:PropTypes.func.isRequired
};

EsewaSdk.defaultProps = {
  currency: 'NPR'
};
