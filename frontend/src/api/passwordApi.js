import axios from './axios';
// get all passwords
export const getAllPasswords = async () => {
  try {
    const response = await axios.get('/passwords');
    return { success: true, data: response.data.passwords };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Get password list failed',
    };
  }
};
// add new password
export const addPassword = async passwordData => {
  try {
    const response = await axios.post('/passwords', passwordData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Add new password failed',
    };
  }
};
// update passowrd
export const updatePassword = async (id, passwordData) => {
  try {
    const response = await axios.put(`/passwords/${id}`, passwordData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Update password failed',
    };
  }
};
// delete password
export const deletePassword = async id => {
  try {
    
    await axios.delete(`/passwords/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Delete password failed',
    };
  }
};
