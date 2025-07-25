import {
  FlexAlignType,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import CustomText from './CustomText';
import {color} from '../const/color';
import CustomAvatar from './CustomAvatar';
import {SPSheet} from 'react-native-popup-confirm-toast';
import CustomFilterComp from './CustomFilterComp';
import {sizes} from '../const';
import {TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export type HeaderObjType = {
  isBack?: boolean | (() => void);
  title?: string;
  titleAlign?: 'flex-end' | 'flex-start' | 'center' | 'baseline' | 'stretch';
  showAvatar?: any;
  showRightIcon?: Array<{
    imageSource: any;
    onPress: () => void;
    size?: number;
    color?: string;
  }>;
  searchProps?: {
    showSearchBar: boolean;
    onSearch: (text: string) => void;
  };
  children?: React.ReactNode;
  removeFlexProp?: Boolean;
  showFilterBtn?: Boolean;
  filterOnpress?: any;
  bgColor?: any;
  titleOnpress?: any;
  customStyle?: ViewStyle;
  showRightTxt?: string | number;
};
const noop = () => {};

const MainContainer: React.FC<HeaderObjType> = ({
  isBack,
  title = '',
  titleAlign = 'flex-start',
  showRightIcon = [],
  searchProps,
  filterOnpress,
  children,
  removeFlexProp,
  showFilterBtn,
  showAvatar,
  bgColor,
  customStyle,
  showRightTxt,
}) => {
  const navigation = useNavigation();
  const handleBackPress = () => {
    if (typeof isBack === 'function') {
      isBack();
    } else {
      navigation.goBack();
    }
  };

  const openFilterModal = () => {
    const spSheet = SPSheet;
    spSheet.show({
      component: () => <CustomFilterComp />,
      height: sizes.height / 1.1,
      keyboardHeightAdjustment: false,
      buttonEnabled: false,
      dragTopOnly: true,
      closeOnPressMask: true,
      onClose: () => spSheet.close(),
    });
  };
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<TextInput>(null);

  return (
    <SafeAreaView
      style={[styles.container, customStyle]}
      edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerContainer}>
        {isBack && (
          <TouchableOpacity
            onPress={handleBackPress}
            activeOpacity={0.6}
            style={styles.backIcon}>
            <Image
              source={require('../assets/icons/back.png')}
              style={styles.backImage}
            />
          </TouchableOpacity>
        )}
        {showAvatar && (
          <CustomAvatar name={showAvatar} style={{height: 34, width: 34}} />
        )}
        <View
          style={[
            styles.titleContainer,
            {
              alignItems: titleAlign as FlexAlignType,
              marginLeft: isBack && titleAlign === 'center' ? -36 : 8,
            },
          ]}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        {showFilterBtn && (
          <TouchableOpacity
            style={styles.filterView}
            activeOpacity={0.6}
            onPress={() => openFilterModal()}>
            <Image
              source={require('../assets/icons/linesSetting.png')}
              style={{height: 20, width: 20}}
            />
            <CustomText
              style={{color: '#000', fontSize: 16, fontWeight: '500'}}>
              Filter
            </CustomText>
          </TouchableOpacity>
        )}
        {showRightTxt && (
          <CustomText
            style={{color: color.mainColor, fontSize: 22, marginRight: 8}}>
            {showRightTxt}
          </CustomText>
        )}
        <View style={styles.rightIconsContainer}>
          {Array.isArray(showRightIcon) &&
            showRightIcon.map((icon, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.6}
                onPress={icon.onPress}
                style={styles.profileIcon}>
                <Image
                  source={icon.imageSource}
                  style={{
                    width: icon?.size || 24,
                    height: icon?.size || 24,
                    resizeMode: 'contain',
                    tintColor: icon?.color,
                  }}
                />
              </TouchableOpacity>
            ))}
          {searchProps?.showSearchBar && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setShowSearchBar(prev => !prev);
                setTimeout(() => {
                  searchInputRef.current?.focus();
                }, 100);
              }}
              style={styles.profileIcon}>
              <Image
                source={require('../assets/icons/search.png')}
                style={{width: 24, height: 24, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showSearchBar && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              placeholder="Search..."
              value={searchText}
              ref={searchInputRef}
              onChangeText={text => {
                setSearchText(text);
                if (searchProps?.onSearch) {
                  searchProps.onSearch(text);
                }
              }}
              placeholderTextColor={'#ccc'}
              style={styles.searchInput}
            />
            {searchText.length > 0 && (
              <TouchableWithoutFeedback
                onPress={() => {
                  setSearchText('');
                  if (searchProps?.onSearch) {
                    searchProps.onSearch('');
                  }
                }}>
                <Image
                  source={require('../assets/icons/crossWithCircle.png')}
                  style={styles.clearIcon}
                />
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      )}

      <View
        style={{
          backgroundColor: bgColor || '#F5F5F5',
          flex: removeFlexProp ? undefined : 1,
        }}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default MainContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backIcon: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    paddingHorizontal: 10,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: `${color.mainColor}40`,
    borderWidth: 0.8,
    borderColor: 'lightgrey',
    marginRight: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 24,
    paddingHorizontal: 12,
    // paddingVertical: 4,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#000',
  },

  clearIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
    tintColor: '#999',
  },
});
