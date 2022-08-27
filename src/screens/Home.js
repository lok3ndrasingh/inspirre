import {
  View,
  Text,
  FlatList,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  Share,
  Modal,
  Linking,
  BackHandler,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {BLUE, NAVY, TEAL, WHITE} from '../constants/Colors';
import Loader from '../components/Loader';
import Spacer2x from '../components/Spacer2x';
const {height, width} = Dimensions.get('screen');

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [quotesList, setQuotesList] = useState([]);
  const [filtersList, setFiltersList] = useState([]);
  const [exitModal, setExitModal] = useState(false);
  const [currentSelected, setSelected] = useState(-1);
  const getQuotes = async () => {
    setLoading(true);

    const userDocument = firestore().collection('quotes').doc('inspirre');
    const filterDocument = firestore().collection('quotes').doc('filters');
    const data = await userDocument.get();
    const filterData = await filterDocument.get();

    let quotesArr = [];
    for (let i in data?._data) {
      quotesArr.push(data?._data[i]);
      console.log(data?._data[i]);
    }
    setLoading(false);
    setQuotesList(quotesArr);
    setRefreshing(false);
    console.log(quotesArr);
    console.log(filterData);
    let filterArr = [];
    for (let f in filterData?._data) {
      filterArr.push(filterData?._data[f]);
    }
    console.log('Filters Arr : ', filterArr);
    setFiltersList(filterArr);
  };
  useEffect(() => {
    getQuotes();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setQuotesList([]);
    getQuotes();
  };

  const handleShare = async item => {
    try {
      const result = await Share.share({
        message: `"${item?.[0] ?? ''}" - ${item?.[1] ?? 'Unknown'}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: NAVY}}>
      <View
        style={{
          height: 30,
          width: width,
          paddingHorizontal: 20,
          paddingTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => setExitModal(true)}>
          <Image
            source={require('../assets/icons/more.png')}
            style={{height: 20, width: 20, tintColor: WHITE}}
          />
        </TouchableOpacity>
        <Text
          style={{
            color: WHITE,
            marginHorizontal: 20,
            position: 'absolute',
            right: 0,
            top: 10,
            fontWeight: '500',
          }}>
          Inspirre
        </Text>
      </View>
      <Spacer2x />
      <Spacer2x />
      <View style={{marginLeft: 20}}>
        <ScrollView horizontal>
          {filtersList.map((x, i) => (
            <TouchableOpacity
            onPress={()=>setSelected(i)}
              style={{
                height: 30,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
                paddingHorizontal: 10,
                backgroundColor: currentSelected==i ? BLUE : `rgba(0,0,0,.5)`,
              }}>
              <Text style={{color: 'white', fontWeight :  currentSelected==i ? 'bold': 'normal' }}>{x}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
              imageStyle={{borderRadius: 10}}
              source={require('../assets/images/mountains.jpg')}
              style={{
                width: width - 40,
                marginHorizontal: 20,
                borderRadius: 10,
                alignSelf: 'center',
                backgroundColor: TEAL,
                height: height - 200,
                padding: 10,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,

                elevation: 9,
              }}>
              <Text
                style={{
                  color: WHITE,
                  fontSize: 20,
                  fontWeight: '400',
                  textAlign: 'justify',
                }}>
                {`"${item?.[0]}"`}
              </Text>
              <Text
                style={{
                  color: WHITE,
                  // alignSelf: 'flex-end',
                  position: 'absolute',
                  bottom: 50,
                }}>{`- ${item?.[1]}`}</Text>
              {/* <Text style={{color: WHITE }}>{item?.[2]}</Text> */}
              <TouchableOpacity
                onPress={() => handleShare(item)}
                style={{position: 'absolute', bottom: 20, right: 20}}>
                <Image
                  source={require('../assets/icons/share.png')}
                  style={{height: 20, width: 20, tintColor: WHITE}}
                />
              </TouchableOpacity>
            </ImageBackground>
          )}
        />
      )}
      <Modal visible={exitModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: `rgba(0,0,0,.9)`,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 150,
              width: width - 100,
              backgroundColor: BLUE,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: WHITE,
                fontWeight: '600',
                alignSelf: 'center',
                marginTop: 30,
              }}
              onPress={() =>
                Linking.openURL('https://www.instagram.com/motivationfor.work/')
              }>
              Click to visit our Instagram Page
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
                position: 'absolute',
                bottom: 0,
                width: width / 1.5,
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setExitModal(false)}
                style={{
                  height: 25,
                  marginHorizontal: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: '500',
                    color: WHITE,
                    marginHorizontal: 10,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => BackHandler.exitApp()}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/images/logout.png')}
                  style={{height: 25, width: 25, tintColor: 'red'}}
                />
                <Text
                  style={{
                    fontWeight: '500',
                    color: WHITE,
                    marginHorizontal: 10,
                  }}>
                  Exit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
