import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import CustomText from './CustomText';
import {color} from '../const/color';
import {SPSheet} from 'react-native-popup-confirm-toast';
import {svgIcons} from '../assets/svg/svg';

const CustomFilterComp = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Filters Data - Can be dynamically fetched or updated
  const filterOptions = [
    {id: 'byDate', label: 'By Date'},
    {id: 'involved', label: 'Involved'},
    {id: 'borrowed', label: 'Borrowed'},
    {id: 'balanceLowToHigh', label: 'Balance - low to high'},
    {id: 'balanceHighToLow', label: 'Balance - high to low'},
    {id: 'maineJoPaisaDiyaHai', label: 'Maine jo paisa diya hai'},
  ];

  const handleApply = () => {
    SPSheet.hide();
    console.log('Applied filter:', selectedFilter);
  };

  const handleClearAll = () => {
    setSelectedFilter(null);
  };

  const handleRadioSelect = (filter: any) => {
    setSelectedFilter(filter);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Filters</Text>

      <View style={styles.filterSection}>
        {filterOptions.map(filter => (
          <View style={styles.rowListing} key={filter.id}>
            <Text style={styles.filterCategory}>{filter.label}</Text>
            <TouchableOpacity onPress={() => handleRadioSelect(filter.id)}>
              {selectedFilter === filter.id ? (
                <Image
                  source={require('../assets/icons/radioSelect.png')}
                  style={{height: 24, width: 24}}
                />
              ) : (
                <Image
                  source={require('../assets/icons/radioUnselect.png')}
                  style={{height: 24, width: 24}}
                />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <CustomText style={styles.clearText}>Clear all</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <CustomText style={styles.applyText}>Apply</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomFilterComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.mainColor,
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 24,
    gap: 12,
  },
  rowListing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignSelf: 'center',
  },
  clearButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    backgroundColor: color.mainColor,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  applyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
