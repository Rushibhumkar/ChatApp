import React, {useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import HeaderBar from './components/HeaderBar';
import PostComposer from './components/PostComposer';
import ShowHideModal from './components/ShowHideModal';
import {myConsole} from '../../utils/myConsole';
import CustomText from '../../components/CustomText';
import {color} from '../../const/color';
import {homeRoute} from '../AuthScreens/routeName';
import {showSuccessToast} from '../../utils/toastModalFunction';

const ComposePostScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute();
  const {media = []} = route.params || {};
  return (
    <View style={{flex: 1}}>
      <HeaderBar
        title="Add post"
        leftIcon={require('../../assets/icons/back.png')}
        onLeftPress={() => navigation.goBack()}
      />
      <FlatList
        data={media}
        horizontal
        keyExtractor={item => item.uri}
        renderItem={({item}) => (
          <Image
            source={{uri: item.uri}}
            style={{width: 200, height: 200, margin: 8, borderRadius: 8}}
          />
        )}
        contentContainerStyle={{paddingVertical: 10}}
      />

      <PostComposer onShowHidePress={() => setModalVisible(true)} />
      <ShowHideModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <TouchableOpacity
        style={{
          marginBottom: 12,
          alignSelf: 'center',
          backgroundColor: color.mainColor,
          paddingHorizontal: 52,
          paddingVertical: 14,
          borderRadius: 12,
        }}
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('HomeStack', {screen: homeRoute.AllStories}),
            showSuccessToast({description: 'Post added successfully'});
        }}>
        <CustomText style={{color: '#fff', fontWeight: '600'}}>Post</CustomText>
      </TouchableOpacity>
    </View>
  );
};
export default ComposePostScreen;
