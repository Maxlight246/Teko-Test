import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import Modal from 'react-native-modal';

const SubmitModal = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [list, setList] = useState('');
  console.log('list: ', list);

  useImperativeHandle(ref, () => ({
    show() {
      setIsVisible(true);
    },
    hide() {
      setIsVisible(false);
    },
    saveList(list) {
      setList(list);
    },
  }));

  const hide = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      style={styles.modal}
      backdropTransitionOutTiming={0}
      backdropOpacity={0.5}
      onBackdropPress={hide}
      isVisible={isVisible}>
      <View style={styles.container}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Submit Changes</Text>

        <TouchableOpacity style={styles.btnSave} onPress={hide}>
          <Text style={{color: 'white', fontWeight: '600'}}>OK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSave} onPress={hide}>
          <Text style={{color: 'white', fontWeight: '600'}}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
});

export default SubmitModal;

const styles = StyleSheet.create({
  modal: {
    // marginHorizontal: 15,
    // justifyContent: 'center',
    // margin: 0,
  },
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 16,
  },
  input: {
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
  },
  containerColorActive: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'gray',
  },
  containerColorInActive: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  txtActive: {
    color: 'white',
  },
  txtInActive: {
    color: 'black',
  },
  btnSave: {
    padding: 10,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
