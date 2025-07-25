import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {color} from '../../../const/color';
import CustomText from '../../../components/CustomText';
import CustomAvatar from '../../../components/CustomAvatar';

interface CustomListingProps {
  icon?: ImageSourcePropType;
  title: string;
  onPress: () => void;
  showAvatar?: Boolean;
  avatarName?: any;
}

const CustomListing: React.FC<CustomListingProps> = ({
  icon,
  title,
  onPress,
  showAvatar = false,
  avatarName,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.innerContainer}>
        {showAvatar ? (
          <CustomAvatar
            name={avatarName}
            style={{height: 40, width: 40, marginRight: 12}}
          />
        ) : (
          <Image source={icon} style={styles.icon} />
        )}

        <CustomText>{title}</CustomText>
      </View>
      <Image
        source={require('../../../assets/icons/rightArrow.png')}
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: color.smoothBg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
    // tintColor: '#000',
    marginRight: 16,
  },
  arrowIcon: {
    height: 12,
    width: 12,
    tintColor: 'grey',
  },
});

export default CustomListing;
