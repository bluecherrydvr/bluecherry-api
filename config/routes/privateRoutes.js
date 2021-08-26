const privateRoutes = {
  'GET /users': 'UserController.getAll',
  'PUT /users/:id': 'UserController.updateUserById',
  'PUT /users/:id/change-device-permission': 'UserController.getCameraPermission',
  'GET /playback': 'DevicesController.getCameras',
  'POST /playback': 'DevicesController.setPlayBack',
  'GET /media/request': 'MediaController.getMediaRequest',
  'GET /general-settings': 'SettingController.getAllSettings',
  'POST /general-settings': 'SettingController.saveAllSettings',
  'POST /test-mail': 'SettingController.sendTestEmail',
  'GET /storage': 'StorageController.getData',
  'POST /storage': 'StorageController.postData',
  'GET /storagecheck': 'StorageController.storageCheck',
  'GET /active-users': 'ActiveUsersController.getAll',
  'POST /kick-user': 'UserController.kickUser',
  'GET /device-schedule': 'DevicesScheduleController.getData',
  'POST /device-schedule': 'DevicesScheduleController.postData',
};

module.exports = privateRoutes;
