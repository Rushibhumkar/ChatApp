import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import CustomBottomModal from '../../components/CustomBottomModal';
import MainContainer from '../../components/MainContainer';

const RateUs = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <MainContainer isBack title="Rate US">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="Open Modal" onPress={() => setModalVisible(true)} />

        <CustomBottomModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}>
          <ScrollView style={{flex: 1}}>
            <Text>Here's a customizable bottom modal.</Text>
            {/* You can place any content here - forms, lists, etc. */}
          </ScrollView>
        </CustomBottomModal>
      </View>
    </MainContainer>
  );
};

export default RateUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  sheetHeight: {
    height: '80%',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    paddingVertical: 6,
  },
});
