import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';

const WORD_HEIGHT = 40;
const words = ['Developer', 'Designer', 'Engineer', 'Architect', 'Leader'];

const SwitchName = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let index = 0;

    const animate = () => {
      index = (index + 1) % words.length;

      Animated.timing(animatedValue, {
        toValue: -WORD_HEIGHT * index,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(animate, 1000); // Delay between switches
      });
    };

    setTimeout(animate, 1000);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.loader}>
        <Text style={styles.staticText}>I am a </Text>
        <View style={styles.words}>
          <Animated.View
            style={[
              styles.wordWrapper,
              {
                transform: [{translateY: animatedValue}],
              },
            ]}>
            {words.map((word, i) => (
              <Text style={styles.word} key={i}>
                {word}
              </Text>
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 80,
  },
  loader: {
    flexDirection: 'row',
    height: WORD_HEIGHT,
    alignItems: 'center',
    overflow: 'hidden',
  },
  staticText: {
    color: '#ccc',
    fontSize: 22,
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  words: {
    height: WORD_HEIGHT,
    overflow: 'hidden',
  },
  wordWrapper: {
    // backgroundColor: 'red',
    marginTop: 5,
    justifyContent: 'flex-start',
  },
  word: {
    height: WORD_HEIGHT,
    fontSize: 22,
    color: '#956afa',
    fontWeight: '600',
    paddingLeft: 6,
    fontFamily: 'Poppins',
  },
});

export default SwitchName;
