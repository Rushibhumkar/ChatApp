import {useState} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';

const useContactsPermission = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);

  const requestContactsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app needs access to your contacts.',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(true);
          const contactsList = await Contacts.getAll();
          setContacts(contactsList);
          setFilteredContacts(contactsList);
          setLoading(false);
        } else {
          console.log('Contacts permission denied');
        }
      } catch (error) {
        console.log('Error fetching contacts:', error);
        setLoading(false);
      }
    }
  };

  return {
    loading,
    contacts,
    filteredContacts,
    requestContactsPermission,
  };
};

export default useContactsPermission;
