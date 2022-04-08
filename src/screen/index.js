import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import EditModal from './EditModal';
import SubmitModal from './SubmitModal';
import {isEqual, chunk} from 'lodash';
import {getAllProduct, getColor} from '../api/productApi';

const index = () => {
  const [listAllProducts, setListAllProducts] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listChange, setListChange] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(true);
  const editModalRef = useRef(null);
  const submitModalRef = useRef(null);
  const validate = useRef(true);

  useEffect(() => {
    getAllProducts();
    getColors();
  }, []);

  const getAllProducts = async () => {
    const products = await getAllProduct();
    if (products) {
      const productsFormat = chunk(products, 10);
      setListAllProducts(productsFormat);
      getProducts(productsFormat);
    }
  };

  const getProducts = productsFormat => {
    const res =
      listAllProducts.length > 0
        ? listAllProducts[currentPage]
        : productsFormat[currentPage];
    if (res && res.length >= 10) {
      setCurrentPage(currentPage + 1);
      setListProducts([...listProducts, ...res]);
    } else if (res && res.length < 10) {
      setListProducts([...listProducts, ...res]);
      setIsLoadMore(false);
    } else {
      setIsLoadMore(false);
    }
  };

  const getColors = async () => {
    const colors = await getColor();
    setListColor(colors || []);
  };

  const onPressEdit = item => {
    editModalRef?.current?.show();
    editModalRef?.current?.saveItem(item);
    editModalRef?.current?.saveListColor(listColor);
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
        <TouchableOpacity
          style={styles.containerEditButton}
          onPress={() => {
            onPressEdit(item);
          }}>
          <Image
            source={require('../assets/icon-edit.png')}
            style={styles.imageItemEdit}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handleEditProduct = itemObj => {
    let listProductsTemp = [...listProducts];
    const objIndex = listProductsTemp.findIndex(obj => obj.id == itemObj.id);
    listProductsTemp[objIndex] = itemObj;
    setListProducts(listProductsTemp);

    //check obj already exist in listChange
    let listChangeTemp = [...listChange];
    const objIndex2 = listChangeTemp.findIndex(obj => obj.id == itemObj.id);
    if (objIndex2 >= 0) {
      listChangeTemp[objIndex2] = itemObj;
      setListChange(listChangeTemp);
      return;
    }
    if (!isEqual(itemObj, listProducts[objIndex])) {
      listChangeTemp.push(itemObj);
      setListChange(listChangeTemp);
    }
  };

  const onPressSubmit = () => {
    submitModalRef?.current?.show();
    submitModalRef?.current?.saveList(listChange);
    submitModalRef?.current?.saveListColor(listColor);
  };

  const handleSubmit = () => {
    for (let i = 0; i < listChange.length; i++) {
      if (
        !listChange[i]?.sku ||
        !listChange[i]?.name ||
        listChange[i]?.name.trim().length > 50 ||
        listChange[i]?.sku.trim().length > 20
      ) {
        alert(`${listChange[i]?.errorDescription} not match validate`);
        validate.current = false;
        break;
      } else {
        validate.current = true;
      }
    }
    if (validate.current) {
      setListChange([]);
      submitModalRef?.current?.hide();
      alert('Submit Success');
    }
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        {isLoadMore && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={getProducts}
            //On Click of button load more data
            style={styles.loadMoreBtn}>
            <Text style={styles.btnText}>Load More</Text>
          </TouchableOpacity>
        )}
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
        ListFooterComponent={renderFooter}
      />

      <View style={styles.containerBtnSubmit}>
        <TouchableOpacity
          style={listChange.length > 0 ? styles.btnSubmit : styles.btnDisable}
          onPress={onPressSubmit}
          disabled={!listChange.length > 0}>
          <Text
            style={{
              color: '#fff',
              fontWeight: '600',
            }}>{`SUBMIT(${listChange.length})`}</Text>
        </TouchableOpacity>
      </View>

      <EditModal ref={editModalRef} handleEditProduct={handleEditProduct} />
      <SubmitModal ref={submitModalRef} handleSubmit={handleSubmit} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    borderWidth: 1,
    boderColor: 'gray',
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
  btnDisable: {
    flex: 1,
    backgroundColor: 'gray',
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
