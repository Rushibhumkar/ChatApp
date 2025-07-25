import {FormikValues} from 'formik';
import React, {useState, useCallback} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  FlatList,
  TextStyle,
  Image,
} from 'react-native';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {debounce} from 'lodash';
import {svgIcons} from '../assets/svg/svg';
import {color} from '../const/color';
import {myConsole} from '../utils/myConsole';
import {customDropdownStyle, shadow} from '../sharedStyles';
import CustomText from './CustomText';

interface Item {
  label: string;
  value: string;
}

interface DropdownRNEProps {
  label?: string;
  name?: string;
  formik?: FormikValues;
  items: Item[];
  labelFieldKey?: string;
  valueFieldKey?: string;
  placeholder?: string;
  mb?: number;
  mt?: number;
  val?: any;
  load?: any;
  customStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  isMultiSelect?: boolean;
  query?: {
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => void;
  };
  // onChange?: any;
  onChange?: (item: Item) => void; // ✅ Add this to props
  onChangeText?: (value: string) => void;
  debounceTime?: number;
  search?: boolean;
  height?: 'auto' | number;
  disable?: boolean;
  type?: 'primary' | 'secondary';
  dropdownPosition?: 'bottom' | 'top' | 'auto' | undefined;
  onOpen?: (v: boolean) => void;
  onClose?: (v: boolean) => void;
  field?: any;
  showSingleSelectSearchbar?: any;
}

const DropdownRNE: React.FC<DropdownRNEProps> = ({
  field,
  label = field?.label,
  name = field?.name,
  formik,
  items,
  labelFieldKey = 'label',
  valueFieldKey = 'value',
  placeholder = field?.placeholder,
  val,
  mb = 4,
  mt = 4,
  customStyle,
  dropdownStyle,
  isMultiSelect = field?.type === 'multi-select',
  query,
  onChange,
  onChangeText,
  debounceTime = 500,
  search = false,
  height,
  disable,
  onOpen,
  onClose,
  load,
  showSingleSelectSearchbar,
  dropdownPosition = 'auto',
  type,
  placeholderStyle,
  selectedTextStyle,
  ...props
}) => {
  if (formik?.values?.lead) {
  }
  const [isFocus, setIsFocus] = useState(false);
  const error =
    (formik?.submitCount > 0 || formik?.touched?.[name]) &&
    formik?.errors?.[name];
  // const error = formik?.errors?.[name] || formisk?.submitCount > 0;
  const [refreshing, setRefreshing] = useState(false);
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    refetch,
  } = query || {};
  const debouncedOnChangeText = useCallback(
    debounce((value: string) => {
      onChangeText && onChangeText(value);
    }, debounceTime),
    [],
  );
  const onEndReach = () => {
    if (hasNextPage && !isFetchingNextPage && !isLoading && items?.length > 0) {
      fetchNextPage && fetchNextPage();
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    refetch && refetch();
    setRefreshing(false);
  };

  const renderItem = (item: Item) => (
    <View style={styles.item}>
      <CustomText style={styles.selectedTextStyle}>
        {item?.[labelFieldKey]}
      </CustomText>
    </View>
  );

  const detectOpenOrClose = (v: boolean) => {
    setIsFocus(v);
    if (v) {
      onOpen && onOpen(v);
    } else {
      setTimeout(() => {
        onClose && onClose(v);
      }, 200); // Small delay to ensure it registers properly
    }
  };

  return (
    <View style={[customStyle, {marginTop: mt, marginBottom: mb}]}>
      {label && <CustomText style={styles.label}>{label}</CustomText>}
      {!isMultiSelect ? (
        <Dropdown
          disable={disable}
          onFocus={() => detectOpenOrClose(true)}
          onBlur={() => detectOpenOrClose(false)}
          style={[
            styles.dropdown,
            type === 'primary'
              ? styles.primary
              : {
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 8,
                  height: 42,
                },
            dropdownStyle,
            disable && {backgroundColor: '#f0f0f0'},
          ]}
          data={items}
          labelField={labelFieldKey}
          valueField={valueFieldKey}
          placeholder={placeholder || label || 'Select an option'}
          placeholderStyle={[{fontSize: 14, color: '#ccc'}, placeholderStyle]}
          value={formik?.values[name] || val}
          onChange={item => {
            formik?.setFieldValue(name, item[valueFieldKey]);
            onChange?.(item);
          }}
          search={showSingleSelectSearchbar ?? type !== 'primary'}
          searchPlaceholder="Search..."
          selectedTextStyle={[selectedTextStyle, {color: 'black'}]}
          renderItem={renderItem}
          flatListProps={{
            height: 'auto',
            ListEmptyComponent: (
              <View style={styles.emptyComponent}>
                {!isFetchingNextPage && (isLoading || isFetching) && load && (
                  <ActivityIndicator />
                )}
                {load && (
                  <ActivityIndicator size={'small'} color={color.mainColor} />
                )}
                {!load && !isLoading && !isFetchingNextPage && (
                  <CustomText fontSize={16} fontWeight="500" color="#ccc">
                    No Data Found
                  </CustomText>
                )}
              </View>
            ),
            onEndReached: onEndReach,
            onEndReachedThreshold: 0.5,
            ListFooterComponent: hasNextPage && isFetchingNextPage && (
              <ActivityIndicator size="small" color="#002E6B" />
            ),
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
          // search={true} // Enable search bar
          // searchPlaceholder="Search..." // Add placeholder for the search bar
          // inputSearchStyle={{
          //   color: 'black',
          //   borderRadius: 6,
          //   fontSize: 16,
          //   paddingHorizontal: 10,
          // }} // Customize search input style
          renderRightIcon={() => {
            if (disable) {
              return null;
            }
            return isFocus ? (
              <Image
                source={require('../assets/icons/up.png')}
                style={{height: 14, width: 14, tintColor: 'grey'}}
              />
            ) : (
              <Image
                source={require('../assets/icons/down.png')}
                style={{height: 14, width: 14, tintColor: 'grey'}}
              />
            );
          }}
          inputSearchStyle={{color: 'black'}}
          containerStyle={[
            styles.containerStyle,
            {marginBottom: 16, maxHeight: 300, borderRadius: 8},
          ]}
          dropdownPosition={dropdownPosition}
          {...props}
        />
      ) : (
        <MultiSelect
          disable={disable}
          style={[styles.multiDropdown, {borderColor: error ? 'red' : '#ccc'}]}
          inputSearchStyle={styles.inputSearchStyle}
          data={items}
          labelField={labelFieldKey}
          valueField={valueFieldKey}
          placeholder={placeholder || label || 'Select an option'}
          placeholderStyle={[{fontSize: 16, color: '#ccc'}, placeholderStyle]}
          value={formik?.values?.[name] || []}
          search
          searchPlaceholder="Search..."
          onChangeText={text => debouncedOnChangeText(text)} // Use the debounced onChangeText
          onChange={item => {
            formik?.setFieldValue(name, item);
          }}
          renderRightIcon={() => {
            return isFocus ? <svgIcons.upIcon /> : <svgIcons.downIcon />;
          }}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity
              key={item.value}
              style={[
                customDropdownStyle.selectedItem,
                shadow,
                {backgroundColor: '#ebf5f7', gap: 6},
              ]}
              onPress={() => unSelect && unSelect(item)}>
              <Text style={customDropdownStyle.selectedText}>
                {item?.[labelFieldKey]}
              </Text>
              <svgIcons.crossCircle />
            </TouchableOpacity>
          )}
          flatListProps={{
            height: height === 'auto' ? 'auto' : height ?? 300,
            ListEmptyComponent: (
              <View style={styles.emptyComponent}>
                {isLoading || (isFetching && <ActivityIndicator />)}
                {load && (
                  <ActivityIndicator size={'small'} color={color.mainColor} />
                )}
                {!load && !isLoading && (
                  <CustomText fontSize={18} fontWeight="500" color="#ccc">
                    No Data Found
                  </CustomText>
                )}
              </View>
            ),
            onEndReached: onEndReach,
            onEndReachedThreshold: 0.5,
            ListFooterComponent: isFetchingNextPage && (
              <ActivityIndicator size="small" color="#002E6B" />
            ),
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
          inputSearchStyle={{
            color: 'black',
            borderRadius: 6,
            marginHorizontal: 12,
          }}
          // containerStyle={[
          //   styles.containerStyle,
          //   {marginTop: 16, maxHeight: 300, borderRadius: 8},
          // ]}
          dropdownPosition={dropdownPosition}
          containerStyle={[
            styles.containerStyle,
            {
              marginTop: 16,
              maxHeight: 300,
              borderRadius: 8,
              position: 'relative',
            },
          ]}
          {...props}
        />
      )}
      {error && (
        <CustomText style={styles.errorText}>{formik?.errors[name]}</CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    marginLeft: 2,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  containerStyle: {
    paddingVertical: 10,
    borderRadius: 4,
  },
  dropdown: {
    height: 48,
    paddingHorizontal: 10,
    color: 'black',
    fontWeight: '400',
  },
  multiDropdown: {
    height: 48,
    paddingHorizontal: 10,
    color: 'black',
    fontWeight: '400',
    borderWidth: 1,
    borderRadius: 8,
  },
  primary: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#00A4D6',
  },
  secondary: {
    borderWidth: 1,
    // borderColor: color.placeholderColor || '#ccc',
    borderRadius: 8,
  },
  item: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 8,
    paddingVertical: 8,
  },
  selectedTextStyle: {
    fontSize: 13,
    color: 'grey',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowOffset: {
      width: 0,
      height: 0.8,
    },
    borderRadius: 4,
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1.5,
  },
  textSelectedStyle: {
    marginRight: 8,
    fontSize: 14,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 5,
  },
  emptyComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#ccc',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});

export default DropdownRNE;
