import axios from 'axios';

const API_ENDPOINT = 'https://hiring-test.stag.tekoapis.net/api';

export const getAllProduct = async () => {
  try {
    const url = `${API_ENDPOINT}/products`;
    let res = await axios({
      method: 'get',
      url: url,
    });
    return res?.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getColor = async () => {
  try {
    const url = `${API_ENDPOINT}/colors`;
    let res = await axios({
      method: 'get',
      url: url,
    });
    return res?.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};
