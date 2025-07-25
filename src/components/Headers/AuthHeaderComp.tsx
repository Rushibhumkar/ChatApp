import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {titleColor} from '../../sharedStyles';

interface AuthHeaderCompProps {
  title: string;
  isBack?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

const AuthHeaderComp: React.FC<AuthHeaderCompProps> = ({
  title,
  isBack = false,
  onPress,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {isBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onPress ? onPress : () => navigation.goBack()}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={{height: 24, width: 24}}
          />
        </TouchableOpacity>
      )}
      <Text
        style={[
          styles.title,
          {marginTop: !isBack ? 60 : 0, marginLeft: isBack ? -24 : 0},
        ]}>
        {title}
      </Text>
    </View>
  );
};

export default AuthHeaderComp;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
    borderRadius: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: titleColor,
  },
});
