import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {showSuccessToast} from '../utils/toastModalFunction';
import {customDataListingStyle} from '../sharedStyles';
import {color} from '../const/color';

interface CustomDataListingProps {
  data: any; // Replace "any" with a more specific type as needed
  leftWidth?: string;
  rightWidth?: string;
  showCopyIcon?: boolean;
  mt?: number;
  mb?: number;
  customViewStyling?: ViewStyle; // or React.CSSProperties for web styling
}

const CustomDataListing: React.FC<CustomDataListingProps> = ({
  data,
  leftWidth = '40%',
  rightWidth = '60%',
  showCopyIcon = false,
  mt = 0,
  mb = 0,
  customViewStyling,
}) => {
  const handleCopyToClipboard = (label: string, value: string) => {
    showSuccessToast({description: `${label} URL successfully copied!`});
    Clipboard.setString(value);
  };

  return (
    <View
      style={[
        customDataListingStyle.container,
        customViewStyling,
        {marginTop: mt, marginBottom: mb},
      ]}>
      {data.map((item: any, ind: number) => (
        <View
          key={ind}
          style={[
            customDataListingStyle.row,
            {alignItems: item?.isProof ? 'center' : 'flex-start'},
          ]}>
          <Text
            style={[
              customDataListingStyle.label,
              {width: leftWidth} as TextStyle,
            ]}>
            {item.label}
          </Text>
          <View
            style={[
              customDataListingStyle.valueContainer,
              {
                width: rightWidth,
                flexDirection: 'row',
                alignItems: item?.isProof ? 'center' : 'flex-start',
              } as ViewStyle,
            ]}>
            <Text style={{color: '#000', fontWeight: '600', marginRight: 4}}>
              :
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
              }}>
              <Text
                style={[
                  customDataListingStyle.participant,
                  {flex: 1, flexShrink: 1, marginRight: 8},
                ]}
                onPress={() => {
                  if (showCopyIcon && typeof item.value === 'string') {
                    Linking.openURL(item.value).catch(err =>
                      console.error('Failed to open URL:', err),
                    );
                  }
                }}
                numberOfLines={showCopyIcon ? 2 : undefined}>
                {Array.isArray(item.value) ? item.value.join(', ') : item.value}
              </Text>
              {showCopyIcon && !Array.isArray(item.value) && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{paddingHorizontal: 4, marginRight: 12}}
                  onPress={() =>
                    handleCopyToClipboard(item.label, item.value as string)
                  }>
                  <Image
                    source={require('../assets/icons/copy.png')}
                    style={{height: 24, width: 24, tintColor: color.mainColor}}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default CustomDataListing;
