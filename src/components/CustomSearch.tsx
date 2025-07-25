import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ViewStyle,
} from 'react-native';
import {color} from '../const/color';
import {useNavigation} from '@react-navigation/native';

interface CustomSearchProps {
  onSearch: (text: string) => void;
  placeholder: string;
  style?: ViewStyle;
  isBack?: any;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
  onSearch,
  placeholder,
  style,
  isBack = true,
}) => {
  const [text, setText] = useState('');

  const handleChangeText = (newText: string) => {
    setText(newText);
    onSearch(newText);
  };

  const handleClearText = () => {
    setText('');
    onSearch('');
  };
  const navigation = useNavigation();
  return (
    <View style={[styles.container, style]}>
      {isBack && (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icons/back.png')}
            style={{height: 24, width: 24}}
          />
        </TouchableOpacity>
      )}
      <View
        style={{
          borderRadius: 50,
          borderWidth: 1,
          borderColor: color.placeholderColor,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: 12,
          paddingHorizontal: 12,
          paddingRight: isBack ? 4 : 10,
          height: 48,
        }}>
        <TextInput
          value={text}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          style={[styles.searchInput, {width: isBack ? '80%' : '90%'}]}
          placeholderTextColor={color.placeholderColor}
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={text ? handleClearText : undefined}>
          {text ? (
            <Image
              source={require('../assets/icons/close.png')}
              style={{height: 16, width: 16, marginRight: 12}}
              tintColor={'grey'}
            />
          ) : (
            <Image
              source={require('../assets/icons/search.png')}
              style={{height: 24, width: 24}}
              tintColor={'grey'}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    zIndex: 20,
  },
  searchInput: {
    padding: 10,
    fontSize: 15,
    color: '#000',
  },
  iconContainer: {
    padding: 10,
  },
});

export default CustomSearch;
