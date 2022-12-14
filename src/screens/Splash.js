import {View, Text, Image, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {NAVY, WHITE} from '../constants/Colors';
import Spacer from '../components/Spacer';
import SoundPlayer from 'react-native-sound-player';

export default function Splash({navigation}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const applyAnimation = async () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      navigation.replace('Home');
    }, 3500);
  };
  useEffect(() => {
    try {
      SoundPlayer.playSoundFile('inspirre', 'mp3');
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }

    applyAnimation();
  }, []);
  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: NAVY,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Animated.Image
        source={require('../assets/images/inspirre.png')}
        style={{height: 70, width: 280, opacity}}
        resizeMode="contain"
      />
      <Spacer />
      <Animated.Text style={{fontSize: 16, opacity: opacity, color: WHITE}}>
        Inspirre
      </Animated.Text>
    </Animated.View>
  );
}
