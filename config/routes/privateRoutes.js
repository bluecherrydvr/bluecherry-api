const privateRoutes = {
  'GET /users': 'UserController.getAll',
  'GET /playback': 'DevicesController.getCameras',
  'POST /playback': 'DevicesController.setPlayBack',
  'GET /media/request': 'MediaController.getMediaRequest',
  'GET /general-settings': 'SettingController.getAllSettings',
  'POST /general-settings': 'SettingController.saveAllSettings',
  'POST /test-mail': 'SettingController.sendTestEmail',
};

module.exports = privateRoutes;
