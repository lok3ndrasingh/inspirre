import {View, Text, FlatList, Dimensions, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {BLUE, NAVY, TEAL, WHITE} from '../constants/Colors';
import Loader from '../components/Loader';
const {height, width} = Dimensions.get('screen');

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [quotesList, setQuotesList] = useState([]);
  const getQuotes = async () => {
    setLoading(true);

    const userDocument = firestore().collection('quotes').doc('inspirre');
    const data = await userDocument.get();

    setQuotesList(data?._data);

    let quotesArr = [];
    for (let i in data?._data) {
      quotesArr.push(data?._data[i]);
      console.log(data?._data[i]);
    }
    setLoading(false);
    setQuotesList(quotesArr);
    setRefreshing(false);
    console.log(quotesArr);
  };
  useEffect(() => {
    getQuotes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setQuotesList([]);
    getQuotes();
  };
  return (
    <View style={{flex: 1, backgroundColor: NAVY}}>
      {isLoading ? (
        <Loader isVisible={true} />
      ) : (
        <FlatList
          onRefresh={onRefresh}
          refreshing={refreshing}
          data={quotesList}
          pagingEnabled
          horizontal
          renderItem={({item, index}) => (
            <ImageBackground
            imageStyle={{borderRadius :10}}
            source={{uri : 'https://media.istockphoto.com/photos/wild-grass-in-the-mountains-at-sunset-picture-id1322277517?k=20&m=1322277517&s=612x612&w=0&h=ZdxT3aGDGLsOAn3mILBS6FD7ARonKRHe_EKKa-V-Hws='}}
              style={{
                width: width - 20,
                margin: 10,
                borderRadius: 10,
                alignSelf: 'center',
                backgroundColor: TEAL,
                height : height -100,
                padding: 10,
                justifyContent : 'center',
                alignItems : 'center'
              }}>
              <Text style={{color: WHITE, fontSize: 20, fontWeight: '400'}}>
                {item?.[0]}
              </Text>
              <Text
                style={{
                  color: WHITE,
                  alignSelf: 'flex-end',
                }}>{`- ${item?.[1]}`}</Text>
              {/* <Text style={{color: WHITE }}>{item?.[2]}</Text> */}
            </ImageBackground>
          )}
        />
      )}
    </View>
  );
}
