import axios  from 'axios';
import {baseUrl} from '../constants';

export const getData = async endPoint => {
    try {
        const url = `${baseUrl}/${endPoint}`;
        const response  = await axios.get(url)
        return {data:response.data, error:false};
    }
    catch (error) {
        return {error, data:{}};
    }
}

export const postData = async (endPoint, updateData) => {
    try {
        const url = `${baseUrl}/${endPoint}`;
        const response  = await axios({
            method: 'post',
            url,
            data: updateData
        });
        return {data:response.data, error:false};
    }
    catch (error) {
        return {error, data:{}};
    }
}


