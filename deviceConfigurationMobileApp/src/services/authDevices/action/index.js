import {UPDATE_AUTH_DEVICES_MODAL_FIELDS} from '../constants';

export const updateAuthDevices = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_AUTH_DEVICES_MODAL_FIELDS,
    payload: {[key]: value},
  });
};
