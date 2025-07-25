import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {color} from '../const/color';
import {datePickerStyles} from '../sharedStyles';
import {myConsole} from '../utils/myConsole';

interface CustomDatePickerProps {
  field?: any;
  label?: string;
  placeholder?: string;
  name?: string;
  formik?: any;
  mode?: 'date' | 'time' | 'datetime';
  dateFormat?: string;
  minuteInterval?: 1 | 2 | 5 | 10 | 15 | 20 | 30;
  locale?: string;
  minDate?: any;
  maxDate?: any;
}

const getNestedValue = (obj: any, path: string) => {
  return path
    ?.split('.')
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  field,
  label = field?.label,
  placeholder = field?.placeholder || 'Select Date',
  name = field?.name,
  formik,
  mode = field?.subType || 'date',
  dateFormat,
  minuteInterval = 1,
  locale = 'en',
  minDate,
  maxDate,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const formatMap = {
    date: 'DD/MM/YYYY',
    time: 'hh:mm A',
    datetime: 'DD/MM/YYYY hh:mm A',
  };
  const resolvedDateFormat = dateFormat || formatMap[mode];

  const value = getNestedValue(formik?.values, name);
  const error = formik?.errors[name];
  const touched = getNestedValue(formik?.touched, name);

  useEffect(() => {
    if (value) {
      const parsedDate = moment(value, 'DD/MM/YYYY', true).isValid()
        ? moment(value, 'DD/MM/YYYY').toDate()
        : new Date();
      setTempDate(parsedDate);
    }
  }, [value]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    formik.setFieldTouched(name, true);
  };

  const handleConfirm = () => {
    const formattedDate = moment(tempDate).format(resolvedDateFormat);
    console.log('Selected Date:', formattedDate); // Log the selected date
    formik.setFieldValue(name, formattedDate); // Update Formik field value
    setTempDate(new Date(formattedDate)); // Update the local state for UI update
    setModalVisible(false); // Close the modal
  };

  const hasError = error && touched;

  return (
    <View style={datePickerStyles.container}>
      <Text style={datePickerStyles.title}>{label}</Text>
      <TouchableOpacity
        style={[datePickerStyles.inputContainer]}
        onPress={toggleModal}>
        <Text
          style={[
            datePickerStyles.input,
            {color: value ? '#000' : color.placeholderColor},
          ]}>
          {value
            ? moment(value, 'DD/MM/YYYY').format('DD/MM/YYYY')
            : placeholder}
        </Text>

        <Image
          source={require('../assets/icons/calendar.png')}
          style={{height: 24, width: 24, tintColor: 'grey'}}
        />
      </TouchableOpacity>
      {hasError && <Text style={datePickerStyles.errorText}>{error}</Text>}

      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}>
        <View style={datePickerStyles.modalBackground}>
          <View style={datePickerStyles.datePickerContainer}>
            <Text style={datePickerStyles.modalTitle}>Select {label}</Text>
            <DatePicker
              textColor="#000"
              date={tempDate}
              mode={mode}
              theme="light"
              onDateChange={setTempDate}
              minimumDate={minDate || new Date()}
              maximumDate={maxDate || new Date()}
              minuteInterval={minuteInterval}
              locale={locale}
            />
            <View style={datePickerStyles.btnContainer}>
              <TouchableOpacity
                onPress={toggleModal}
                style={datePickerStyles.cancelButton}>
                <Text style={datePickerStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={datePickerStyles.confirmButton}>
                <Text style={datePickerStyles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDatePicker;
