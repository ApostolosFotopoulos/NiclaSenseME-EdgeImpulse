const constants = {
  DEBUG: true,
  USER_REGEX: /^[A-z][A-z0-9-_]{3,23}$/,
  NAME_REGEX: /^[a-zA-Z]+([ \\'-]{0,1}[a-zA-Z]+){0,2}[.]{0,1}$/,
  PWD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
  SERVICE_UUID: "9a48ecba-2e92-082f-c079-9e75aae428b1",
  CHARACTERISTIC_UUID: "2d2f88c4-f244-5a80-21f1-ee0224e80658",
  SET_INTERVAL_TIME: 2000,
};

export default constants;

export const {
  DEBUG,
  USER_REGEX,
  NAME_REGEX,
  PWD_REGEX,
  SERVICE_UUID,
  CHARACTERISTIC_UUID,
  SET_INTERVAL_TIME,
} = constants;
