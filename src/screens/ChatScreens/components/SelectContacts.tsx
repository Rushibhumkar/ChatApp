import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import useContactsPermission from '../../../hooks/useContactsPermission';
import {myConsole} from '../../../utils/myConsole';
import {MsgDataType} from '../../../utils/typescriptInterfaces';
import LoadingCompo from '../../../components/LoadingCompo/LoadingCompo';
import CustomSearch from '../../../components/CustomSearch';
import CustomText from '../../../components/CustomText';
import CustomButton from '../../../components/Buttons/CustomButton';

const SelectContacts = ({navigation, route}: any) => {
  const {onContactSelect} = route.params || {};
  const [searchQuery, setSearchQuery] = React.useState('');
  const {loading, contacts, filteredContacts, requestContactsPermission} =
    useContactsPermission();
  const [selectedContact, setSelectedContact] = React.useState<
    MsgDataType['contact'] | null
  >(null);

  useFocusEffect(
    React.useCallback(() => {
      requestContactsPermission(); // Request contacts permission when screen is focused
    }, []),
  );

  const getPhoneNumber = (phoneNumbers: any) => {
    return phoneNumbers && phoneNumbers.length > 0
      ? phoneNumbers[0].number
      : 'No phone number available';
  };
  const filteredContactsBySearch = filteredContacts.filter(contact =>
    contact?.displayName?.toLowerCase()?.includes(searchQuery?.toLowerCase()),
  );

  const renderItem = ({item}: any) => {
    const profileUrl = item.thumbnailPath ? item.thumbnailPath : null;

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => {
          const contactData = {
            name: item.displayName || '',
            phoneNumber: getPhoneNumber(item.phoneNumbers),
            profilePicture: profileUrl || '',
            email:
              item.emailAddresses && item.emailAddresses.length > 0
                ? item.emailAddresses[0].email
                : '',
          };
          setSelectedContact(contactData);
        }}>
        <View>
          <CustomText style={styles.contactName}>{item.displayName}</CustomText>
          {/* {profileUrl && (
            <CustomText style={styles.profileUrl}>Profile</CustomText>
          )} */}
          <CustomText style={styles.phoneNumber}>
            {getPhoneNumber(item.phoneNumbers)}
          </CustomText>
        </View>
        {selectedContact?.phoneNumber === getPhoneNumber(item.phoneNumbers) &&
          selectedContact?.name === item.displayName && (
            <Image
              source={require('../../../assets/icons/checkmark.png')}
              style={{height: 22, width: 22}}
            />
          )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomSearch
        placeholder="Search contacts"
        onSearch={setSearchQuery}
        // isBack={false}
      />
      {loading ? (
        <LoadingCompo />
      ) : (
        <>
          <FlatList
            data={filteredContactsBySearch}
            keyExtractor={item => item.recordID.toString()}
            renderItem={renderItem}
          />
        </>
      )}
      {selectedContact && (
        <CustomButton
          title="Send"
          onPress={() => {
            if (onContactSelect) {
              onContactSelect(selectedContact);
            }
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contactItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileUrl: {
    fontSize: 14,
    color: 'blue',
    marginVertical: 5,
  },
  phoneNumber: {
    fontSize: 16,
    color: 'gray',
  },
  searchBar: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 50,
    justifyContent: 'center',
  },
});

export default SelectContacts;
