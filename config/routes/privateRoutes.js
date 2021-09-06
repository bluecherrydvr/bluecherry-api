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
  'GET /notification': 'NotificationController.getData',
  'GET /notification/:id': 'NotificationController.getDataById',
  'POST /notification': 'NotificationController.postData',
  'PUT /notification/:id': 'NotificationController.editData',
  'PUT /notification/:id/toggle-status': 'NotificationController.toggleStatus',
  'DELETE /notification/:id': 'NotificationController.removeDataById',
  'GET /webhooks': 'WebhookController.getData',
  'GET /webhooks/:id': 'WebhookController.getDataById',
  'POST /webhooks': 'WebhookController.postData',
  'PUT /webhooks/:id': 'WebhookController.editData',
  'DELETE /webhooks/:id': 'WebhookController.removeDataById',
  'GET /subdomain-provider': 'SubdomainProviderController.getData',
  'GET /subdomain-provider-query': 'SubdomainProviderController.querySubdomain',
  'GET /subdomain-provider-get-ip': 'SubdomainProviderController.getIp',
  'DELETE /subdomain-provider': 'SubdomainProviderController.removeProvider',
  'GET /statistics': 'StatisticsController.getData',
  'POST /statistics': 'StatisticsController.getStatistics',
  'GET /logs': 'LogsController.getData',
  'GET /downloadlogs': 'LogsController.downloadLogs',
};

module.exports = privateRoutes;
