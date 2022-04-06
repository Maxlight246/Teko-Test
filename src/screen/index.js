import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const index = () => {
  const [listProducts, setListProducts] = useState([]);
  const [listColor, setListColor] = useState([]);

  React.useEffect(() => {
    getProduct();
    getColor();
  }, []);

  const getProduct = () => {
    axios
      .get(`https://hiring-test.stag.tekoapis.net/api/products`)
      .then(res => {
        const products = res.data;
        setListProducts(products);
      });
  };

  const getColor = () => {
    axios.get(`https://hiring-test.stag.tekoapis.net/api/colors`).then(res => {
      const colors = res.data;
      setListColor(colors);
    });
  };

  const getColorName = id => {
    const obj = listColor.find(col => col.id === id);
    return obj?.name;
  };

  const renderItemProduct = ({item, index}) => {
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
        <TouchableOpacity style={styles.containerEditButton}>
          <Image
            source={require('../assets/icon-edit.png')}
            style={styles.imageItemEdit}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listProducts}
        keyExtractor={item => {
          return `Products${item.id}`;
        }}
        renderItem={renderItemProduct}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
      />

      <View style={styles.containerBtnSubmit}>
        <TouchableOpacity style={styles.btnSubmit}>
          <Text style={{color: '#fff', fontWeight: '600'}}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  containerItem: {
    flexDirection: 'row',
    // flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
    marginHorizontal: 16,
    marginVertical: 5,
    backgroundColor: '#fff',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    // elevation: 5,
  },
  imageItem: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imageItemError: {
    width: '70%',
    height: '70%',
  },
  containerImageItem: {
    width: 100,
    height: 100,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  containerProduct: {
    justifyContent: 'center',
    flex: 5,
    marginLeft: 10,
  },
  containerEditButton: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
  },
  imageItemEdit: {
    width: 20,
    height: 20,
  },
  containerBtnSubmit: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
  },
  btnSubmit: {
    flex: 1,
    backgroundColor: 'pink',
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
