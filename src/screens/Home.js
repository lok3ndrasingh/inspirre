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
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {BLUE, NAVY, TEAL, WHITE} from '../constants/Colors';
import Loader from '../components/Loader';
import Spacer2x from '../components/Spacer2x';
const {height, width} = Dimensions.get('screen');
import LinearGradient from 'react-native-linear-gradient';

export default function Home() {
  const scrollX = useRef(new Animated.Value(0)).current;
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
            <LinearGradient
              colors={
                currentSelected == i
                  ? ['red', 'yellow', 'aqua']
                  : ['black', 'white']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                height: 30,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <TouchableOpacity
                onPress={() => setSelected(i)}
                style={{
                  height: 28,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 1,
                  marginRight: 1.5,
                  marginTop: 1,
                  marginBottom: 1,
                  paddingHorizontal: 10,
                  zIndex: 1,
                  backgroundColor: 'black',
                  // backgroundColor: currentSelected == i ? BLUE : `rgba(0,0,0,.5)`,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: currentSelected == i ? 'bold' : 'normal',
                  }}>
                  {x}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>
      {isLoading ? (
        <Loader isVisible={true} />
      ) : (
        <Animated.FlatList
          onRefresh={onRefresh}
          refreshing={refreshing}
          data={quotesList}
          pagingEnabled
          extraData={quotesList}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}
          // onMomentumScrollEnd={()=>alert('Hi')}
          horizontal
          renderItem={({item, index}) => {
            const inputRange = [
              (index - 1) * width,
              width * index,
              width * (index + 1),
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [1, 1, 0],
            });
            const rotate = scrollX.interpolate({
              inputRange,
              outputRange: ['0deg', '0deg', '-30deg'],
            });

            const rotateY = scrollX.interpolate({
              inputRange,
              outputRange: ['0deg', '360deg', '0deg'],
            });
            const opacityRange = [
              (index - 1) * width,
              index * width,
              width * (index + 1),
            ];
            const opacity = scrollX.interpolate({
              inputRange: opacityRange,
              outputRange: [1, 1, 0],
            });

            const scaleYText = scrollX.interpolate({
              inputRange: opacityRange,
              outputRange: [1.2, 1, 0],
            });
            const scaleCircle = scrollX.interpolate({
              inputRange: opacityRange,
              outputRange: [0, 1, 0],
            });

            return (
              <Animated.View
                // imageStyle={{borderRadius: 10}}
                // source={require('../assets/images/mountains.jpg')}
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
                  transform: [{scale, rotate}],
                  opacity,
                }}>
                <Image
                  source={require('../assets/images/mountains.jpg')}
                  style={{
                    height: height - 200,
                    width: width - 40,
                    position: 'absolute',
                    zIndex: -100,
                    borderRadius: 10,
                  }}
                  blurRadius={5}
                />
                {/* Quote */}
                <Animated.Text
                  style={{
                    color: WHITE,
                    fontSize: 20,
                    fontWeight: '400',
                    textAlign: 'justify',
                    transform: [{scaleY: scaleYText}],
                  }}>
                  {`"${item?.[0]}"`}
                </Animated.Text>
                {/* Author */}
                <Animated.Text
                  style={{
                    color: WHITE,
                    // alignSelf: 'flex-end',
                    position: 'absolute',
                    bottom: 70,
                    transform: [{rotateY}],
                  }}>{`- ${item?.[1]}`}</Animated.Text>
                {/* <Text style={{color: WHITE }}>{item?.[2]}</Text> */}
                <TouchableOpacity
                  onPress={() => handleShare(item)}
                  style={{position: 'absolute', bottom: 20, right: 20}}>
                  <Image
                    source={require('../assets/icons/share.png')}
                    style={{height: 20, width: 20, tintColor: WHITE}}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                  }}>
                  {['gray', 'green', 'yellow', 'blue', 'white'].map(x => (
                    <Animated.Image
                      // source={require('../assets/images/mountains.jpg')}
                      style={{
                        height: 30,
                        width: 30,
                        marginHorizontal: 5,
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: x,
                        backgroundColor: 'hsl(203deg 58% 17%)',
                        opacity,
                        transform: [{scale: scaleCircle}],
                      }}></Animated.Image>
                  ))}
                </View>
              </Animated.View>
            );
          }}
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
