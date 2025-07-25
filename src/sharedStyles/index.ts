import {Platform, StyleSheet} from 'react-native';
import {sizes} from '../const';
import {color} from '../const/color';
export const titleColor = '#333854';
export const topTabContainer = StyleSheet.create({
  tabHeaderContainer: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  tabButton: {
    marginHorizontal: 8,
    paddingHorizontal: 4,
    paddingVertical: 10,
    // minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: color.mainColor,
  },
  tabTitle: {
    fontSize: 15,
    color: '#888',
  },
  selectedTabText: {
    color: color.mainColor,
    fontWeight: 'bold',
  },
  pagerView: {
    marginTop: 8,
    flex: 1,
    backgroundColor: '#fff',
  },
});

export const dataListingCont = StyleSheet.create({
  page: {
    padding: 12,
    backgroundColor: '#fff',
    flex: 1,
  },
});

export const shadow = {
  shadowColor: '#000',
  shadowOffset: {width: 0.5, height: 1},
  shadowOpacity: Platform.OS === 'ios' ? 0.4 : 1,
  elevation: 4,
  shadowRadius: 1,
};

export const customDropdownStyle = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
  },
  title: {
    marginLeft: 2,
    marginBottom: 4,
    color: '#000',
    fontWeight: '600',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: color.placeholderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 12,
  },
  placeholder: {
    color: color.placeholderColor,
  },
  selectedText: {
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  errorBorder: {
    borderColor: 'red',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    marginVertical: 4,
    marginRight: 8,
  },
  deleteIcon: {
    marginLeft: 8,
    width: 16,
    height: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const datePickerStyles = StyleSheet.create({
  container: {
    marginTop: 8,
    gap: 4,
  },
  title: {
    marginTop: 2,
    marginLeft: 2,
    fontWeight: '600',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: color.placeholderColor,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#D3D3D3',
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#000',
    fontWeight: '500',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: color.mainColor,
    borderRadius: 8,
    flex: 1,
  },
  confirmButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
  errorBorder: {
    borderColor: 'red',
  },
});

export const myStyle = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexAround: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flexBetween: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: color.mainColor,
    alignSelf: 'center',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const customDataListingStyle = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    paddingBottom: 16,
    gap: 8,
  },
  downloadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: color.mainColor,
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#000',
    fontWeight: '600',
    fontSize: 15,
  },
  valueContainer: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  column: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  participant: {
    color: 'grey',
    fontSize: 15,
    fontWeight: '300',
    flexWrap: 'nowrap',
  },
  copiedIcon: {
    paddingHorizontal: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  closeText: {
    color: '#000',
    fontWeight: '600',
  },
});

export const row = {
  flexDirection: 'row',
  alignItems: 'center',
};

export const chatScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  attachmentContStyle: {
    minHeight: null,
    minWidth: null,
    width: sizes.width,
  },
  viewImg: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  chatArea: {
    flexGrow: 1,
    padding: 10,
    justifyContent: 'flex-end',
    paddingTop: 100,
  },
  popupMenu: {
    position: 'absolute',
    right: 10,
    top: 50,
    backgroundColor: color.smoothBg,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  messageText: {
    fontSize: 16,
  },
  sendBtn: {
    paddingLeft: 6,
    paddingRight: 4,
    borderRadius: 50,
    backgroundColor: color.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentPopup: {
    position: 'absolute',
    marginBottom: 8,
    bottom: 60,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: color.smoothBg,
    borderRadius: 16,
    paddingVertical: 10,
  },
  attachmentItem: {
    alignItems: 'center',
  },
  attachmentIcon: {
    width: 28,
    height: 28,
    marginBottom: 5,
    tintColor: color.mainColor,
  },
  attachmentText: {
    fontSize: 12,
    color: color.mainColor,
  },
  mainInputCont: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 6,
  },
  emojiContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: sizes.height / 1.4,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },

  fileName: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  image: {
    // width: 200,
    height: 400,
    marginTop: 10,
    borderRadius: 8,
  },
  sendHiMsg: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  customEmojiBgStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 100,
    paddingBottom: 0,
  },
  viewCamMainView: {
    flex: 1,
    height: sizes.height,
    width: sizes.width,
    position: 'absolute',
    top: 0,
  },
  switchCamBtn: {
    position: 'absolute',
    bottom: 100,
    right: '10%',
    backgroundColor: '#00000040',
    padding: 8,
    borderRadius: 50,
  },
  captureCamBtn: {
    position: 'absolute',
    bottom: 100,
    left: '44%',
    backgroundColor: '#00000040',
    borderRadius: 50,
    padding: 10,
  },
  retakeCamBtn: {
    position: 'absolute',
    bottom: 100,
    left: '10%',
    backgroundColor: '#00000040',
    padding: 8,
    borderRadius: 50,
  },
  camBackBtn: {
    position: 'absolute',
    top: 20,
    left: '4%',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderRadius: 50,
    paddingHorizontal: 16,
    ...shadow,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
  },
  capturedImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    backgroundColor: '#00000080',
    borderRadius: 20,
  },
  sendButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -35,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 50,
  },
});
