import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import Modal from 'react-native-modal';

const windowHeight = Dimensions.get('window').height;
const SubmitModal = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [list, setList] = useState([]);
  const [listColor, setListColor] = useState([]);
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
    saveListColor(colors) {
      setListColor(colors);
    },
  }));

  const hide = () => {
    setIsVisible(false);
  };

  const getColorName = id => {
    const obj = listColor.find(col => col.id === id);
    return obj?.name;
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.containerItem}>
        <View style={styles.containerImageItem}>
          {item.image ? (
            <Image source={{uri: item.image}} style={styles.imageItem} />
          ) : (
            <Image
              source={require('../assets/icon-image-error.png')}
              style={styles.imageItemError}
            />
          )}
        </View>
        <View style={styles.containerProduct}>
          <Text>{item?.name}</Text>
          <Text>{item?.errorDescription}</Text>
          <Text>{item?.sku}</Text>
          <Text>{getColorName(item?.color)}</Text>
        </View>
      </View>
    );
  };

  const onPressOK = () => {
    props.handleSubmit();
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
        <FlatList
          data={list}
          keyExtractor={item => `product${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{maxHeight: windowHeight * 0.6}}
        />
        <TouchableOpacity style={styles.btnSave} onPress={onPressOK}>
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
  btnSave: {
    padding: 10,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  containerItem: {
    flexDirection: 'row',
    // flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    boderColor: 'gray',
  },
  containerImageItem: {
    width: 100,
    height: 100,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  imageItem: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageItemError: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
  },
  containerProduct: {
    justifyContent: 'center',
    flex: 5,
    marginLeft: 10,
  },
});
