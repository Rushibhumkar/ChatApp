import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import CustomSearch from '../../components/CustomSearch';

const SearchScreen = ({navigation}: any) => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <View style={styles.container}>
      <CustomSearch onSearch={setSearchValue} placeholder="Search ..." isBack />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 12,
  },
});
