import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {color} from '../../../const/color';

interface Props {
  isSeen: boolean;
  isDelivered: boolean;
  isSender: boolean;
}

const MessageStatusTicks: React.FC<Props> = ({
  isSeen,
  isDelivered,
  isSender,
}) => {
  if (!isSender) return null;

  let icon = require('../../../assets/icons/singleTick.png');
  let tint = '#fff';

  if (isSeen) {
    icon = require('../../../assets/icons/doubleTick.png');
    tint = color.bluTextColor;
  } else if (isDelivered) {
    icon = require('../../../assets/icons/doubleTick.png');
  }

  return <Image source={icon} style={styles.tickIcon} tintColor={tint} />;
};

const styles = StyleSheet.create({
  tickIcon: {
    height: 16,
    width: 16,
  },
});

export default MessageStatusTicks;
