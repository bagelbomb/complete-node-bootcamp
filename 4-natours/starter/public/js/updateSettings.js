import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'data' or 'password'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({ method: 'PATCH', url, data });

    if (res.data.status === 'success') {
      const message = `${type === 'password' ? 'Password' : 'Settings'} updated successfully! Reloading...`

      showAlert('success', message);

      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
