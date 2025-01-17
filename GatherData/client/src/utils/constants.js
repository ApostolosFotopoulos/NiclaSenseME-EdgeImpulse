const constants = {
  DEBUG: false,
  SERVICE_UUID: "9a48ecba-2e92-082f-c079-9e75aae428b1",
  CHARACTERISTIC_UUID: "2d2f88c4-f244-5a80-21f1-ee0224e80658",
  SET_INTERVAL_TIME: 2000,
  enableDebug: function () {
    this.DEBUG = true;
  },
};

export default constants;

export const { DEBUG, SERVICE_UUID, CHARACTERISTIC_UUID, SET_INTERVAL_TIME } = constants;
