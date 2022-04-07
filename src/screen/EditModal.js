import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import Modal from 'react-native-modal';

const EditModal = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [item, setItem] = useState('');
  const [listColor, setListColor] = useState([]);
  const [name, onChangeName] = useState('');
  const [sku, onChangeSKU] = useState('');
  const [colorID, setColorID] = useState(null);

  useImperativeHandle(ref, () => ({
    show() {
      setIsVisible(true);
    },
    hide() {
      setIsVisible(false);
    },
    saveItem(item) {
      setItem(item);
      onChangeName(item?.name);
      onChangeSKU(item?.sku);
      setColorID(item?.color);
    },
    saveListColor(colors) {
      setListColor(colors);
    },
  }));

  const hide = () => {
    setIsVisible(false);
  };

  const onPressSave = () => {
    let itemTemp = {...item};
    itemTemp.name = name;
    itemTemp.sku = sku;
    itemTemp.color = colorID;
    props.handleEditProduct(itemTemp);
    hide();
  };

  const onPressColor = id => {
    setColorID(id);
  };

  const renderColor = () => {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {listColor.map(i => (
          <TouchableOpacity
            key={`Color${i.id}`}
            style={
              i.id === colorID
                ? styles.containerColorActive
                : styles.containerColorInActive
            }
            onPress={() => onPressColor(i?.id)}>
            <Text
              style={i.id === colorID ? styles.txtActive : styles.txtInActive}>
              {i.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      style={styles.modal}
      backdropTransitionOutTiming={0}
      backdropOpacity={0.5}
      onBackdropPress={hide}
      isVisible={isVisible}>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        style={{flex: 1, justifyContent: 'center'}}>
        <View style={styles.container}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>
            {item?.errorDescription}
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            value={name}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeSKU}
            value={sku}
            placeholder="SKU"
          />
          {renderColor()}

          <TouchableOpacity style={styles.btnSave} onPress={onPressSave}>
            <Text style={{color: 'white', fontWeight: '600'}}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSave} onPress={hide}>
            <Text style={{color: 'white', fontWeight: '600'}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

export default EditModal;

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
