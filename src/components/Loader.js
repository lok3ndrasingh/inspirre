import {View, Text, Modal} from 'react-native';
import React from 'react';
import Lottie from 'lottie-react-native';
import { NAVY } from '../constants/Colors';
export default function Loader({isVisible = false}) {
  return (
    <View style={{flex: 1, backgroundColor : NAVY}}>
      <Modal visible={isVisible} animationType='fade'>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor : NAVY
          }}>
          <Lottie
            source={require('../assets/lottieFiles/loader.json')}
            autoPlay
            loop
            style={{height: 150, width: 150}}
          />
        </View>
      </Modal>
    </View>
  );
}
