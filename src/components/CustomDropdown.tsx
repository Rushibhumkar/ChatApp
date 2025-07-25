import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {popUpConfToast} from '../utils/toastModalFunction';
import {myConsole} from '../utils/myConsole';
import {svgIcons} from '../assets/svg/svg';
import CustomText from './CustomText';
import {customDropdownStyle, shadow} from '../sharedStyles';

interface DropdownProps {
  items: Array<{label: string; value: string}>;
  onSelect?: (item: any) => void;
  title?: string;
  placeholder?: string;
  labelFieldKey?: any;
  valueFieldKey?: any;
  loading?: boolean;
  isMultiSelect?: boolean;
  selectedValues?: any;
  formik: any;
  name: string;
}

const CustomDropDown: React.FC<DropdownProps> = ({
  items,
  onSelect = () => {},
  title,
  labelFieldKey = 'label',
  valueFieldKey = 'value',
  placeholder,
  loading = false,
  isMultiSelect = false,
  selectedValues = [],
  formik,
  name,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    isMultiSelect ? undefined : selectedValues,
  );
  const [multiSelectedItems, setMultiSelectedItems] = useState<any[]>(
    Array.isArray(selectedValues) && selectedValues.length > 0
      ? selectedValues
      : formik.values?.[name] || [],
  );
  // myConsole('multiSelectedItems', multiSelectedItems);
  const [isFocus, setIsFocus] = useState(false);

  let error = '';
  let touched = false;
  if (name?.includes('.')) {
    const [parent, child] = name.split('.');
    touched = formik?.touched?.[parent]?.[child];
    if (touched) error = formik?.errors?.[parent]?.[child];
  }
  // else {
  //   error =
  //     formik?.errors[name.split('.')[0]] && formik?.touched[name.split('.')[0]];
  // }

  useEffect(() => {
    if (!isMultiSelect) {
      setSelectedItem(selectedValues);
    }
  }, [selectedValues]);

  const handleSingleSelect = (item: {label: string; value: string}) => {
    setSelectedItem(item.value);
    onSelect(item.value);
    formik.setFieldValue(name, item.value);
  };
  const handleMultiSelect = (selectedItems: any[]) => {
    setMultiSelectedItems(selectedItems);
    onSelect(selectedItems);
    formik.setFieldValue(name, selectedItems);
  };

  // const renderItem = (item: any) => (
  //   <View style={styles.item}>
  //     <CustomText style={styles.selectedTextStyle}>
  //       {item?.[labelFieldKey]}
  //     </CustomText>
  //   </View>
  // );

  const renderItem = (item: any) => {
    const nameParts = name.split('.');
    let selectedValues = formik.values;

    for (const part of nameParts) {
      if (selectedValues && selectedValues[part]) {
        selectedValues = selectedValues[part];
      } else {
        selectedValues = [];
        break;
      }
    }
    selectedValues = Array.isArray(selectedValues) ? selectedValues : [];
    const isSelected = selectedValues.includes(item[valueFieldKey]);
    return (
      <View style={styles.item}>
        <CustomText style={styles.selectedTextStyle}>
          {item?.[labelFieldKey]}
        </CustomText>
        {/* {isSelected && <svgIcons.checkmarkIcon height={18} width={18} />} */}
      </View>
    );
  };

  const detectOpenOrClose = (v: boolean) => {
    setIsFocus(v);
  };

  // myConsole(
  //   'formikserrorosoersdf',
  //   formik?.errors[name.split('.')[0]]?.name?.split('.')[1],
  // );

  return (
    <View style={customDropdownStyle.container} key={`dropdown_${name}`}>
      {title && <Text style={customDropdownStyle.title}>{title}</Text>}
      {loading ? (
        <View
          style={[
            customDropdownStyle.dropdown,
            customDropdownStyle.loadingContainer,
          ]}>
          <ActivityIndicator size="small" />
        </View>
      ) : !isMultiSelect ? (
        <Dropdown
          style={[
            customDropdownStyle.dropdown,
            error ? {backgroundColor: 'pink'} : null,
          ]}
          search
          searchPlaceholder="Search..."
          onFocus={() => detectOpenOrClose(true)}
          onBlur={() => {
            formik.setFieldTouched(name, true); // Mark the field as touched
            formik.validateField(name); // Validate the specific field
            detectOpenOrClose(false);
          }}
          data={items}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          placeholderStyle={customDropdownStyle.placeholder}
          value={formik?.values?.[name] || selectedItem}
          onChange={(item: any) => {
            setSelectedItem(item.value);
            onSelect(item); // <- Ensure this works with your gender logic
            formik.setFieldValue(name, item.value);
            formik.setFieldTouched(name, true);
            formik.validateField(name);
          }}
          selectedTextStyle={customDropdownStyle.selectedText}
          //   renderRightIcon={() =>
          //     isFocus ? <svgIcons.upIcon /> : <svgIcons.downIcon />
          //   }
        />
      ) : (
        <MultiSelect
          style={[
            customDropdownStyle.dropdown,
            error ? customDropdownStyle.errorBorder : null,
          ]}
          data={items}
          labelField={labelFieldKey}
          valueField={valueFieldKey}
          placeholder={placeholder || 'Select options'}
          placeholderStyle={customDropdownStyle.placeholder}
          value={formik?.values?.[name] || multiSelectedItems}
          onChange={selectedItems => {
            setMultiSelectedItems(selectedItems);
            onSelect(selectedItems);
            formik.setFieldValue(name, selectedItems); // Update the specific field value
            formik.setFieldTouched(name, true, false); // Mark the field as touched without triggering a form-wide validation
          }}
          selectedTextStyle={customDropdownStyle.selectedText}
          //   renderRightIcon={() =>
          //     isFocus ? <svgIcons.upIcon /> : <svgIcons.downIcon />
          //   }
          onFocus={() => detectOpenOrClose(true)}
          onBlur={() => {
            formik.setFieldTouched(name, true); // Mark the specific dropdown as touched
            detectOpenOrClose(false);
          }}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity
              key={item.value}
              style={[
                customDropdownStyle.selectedItem,
                shadow,
                {backgroundColor: '#ebf5f7'},
              ]}
              onPress={() => unSelect && unSelect(item)}>
              <Text style={customDropdownStyle.selectedText}>
                {item.label || item?.[labelFieldKey] || ''}
              </Text>
              {/* <svgIcons.crossCircle /> */}
            </TouchableOpacity>
          )}
        />
      )}
      {error && <Text style={customDropdownStyle.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomDropDown;
const styles = StyleSheet.create({
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
    fontSize: 14,
    color: 'grey',
  },
});
