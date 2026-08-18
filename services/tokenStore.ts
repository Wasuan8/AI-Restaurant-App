import AsyncStorage from '@react-native-async-storage/async-storage';

let authToken: string | null = null;
let userType: string | null = null;
let userName: string | null = null;

const TOKEN_KEY = 'apnacafe_auth_token';
const USER_TYPE_KEY = 'apnacafe_user_type';
const USER_NAME_KEY = 'apnacafe_user_name';

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const saveSession = async (token: string, type: string, name: string) => {
  authToken = token;
  userType = type;
  userName = name;
  try {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_TYPE_KEY, type],
      [USER_NAME_KEY, name],
    ]);
  } catch (e) {
    console.error('Error saving session', e);
  }
};

export const loadSession = async () => {
  try {
    const [[, token], [, type], [, name]] = await AsyncStorage.multiGet([
      TOKEN_KEY,
      USER_TYPE_KEY,
      USER_NAME_KEY,
    ]);
    authToken = token;
    userType = type;
    userName = name;
    return { token, userType: type, userName: name };
  } catch (e) {
    console.error('Error loading session', e);
    return null;
  }
};

export const clearAuthToken = async () => {
  authToken = null;
  userType = null;
  userName = null;
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_TYPE_KEY, USER_NAME_KEY]);
  } catch (e) {
    console.error('Error clearing session', e);
  }
};