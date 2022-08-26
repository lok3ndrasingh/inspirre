import { View, Text } from 'react-native'
import React, { useEffect } from 'react';
import MainNavigator from './src/navigation/MainNavigator';



export default function App() {
  return (
    <View style={{flex : 1}}>
      <MainNavigator />
    </View>
  )
}