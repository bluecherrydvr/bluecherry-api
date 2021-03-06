const constants = {
  VAR_CONF_PATH: '/etc/bluecherry.conf',

  VAR_ROOT_PATH: '/',

  VAR_LOG_PATH: '/var/log/bluecherry.log',
  VAR_WWW_LOG_PATH: '/var/log/nginx/bluecherry-error.log',

  VAR_NEWS_XML: 'http://www.bluecherrydvr.com/feed/',

  VAR_SESSION_NAME: 'bluecherrydvr',

  JS_RELOAD: '<script>window.location = "/";</script>',

  // versions
  VAR_PATH_TO_CURRENT_VERSION: 'http://versioncheck.bluecherrydvr.com/server-version',
  VAR_PATH_TO_INSTALLED_VERSION: '/usr/share/bluecherry/version',

  VAR_PATH_TO_IPCAMLIST_VERSION: 'http://versioncheck.bluecherrydvr.com/ipcamtableversion',
  VAR_PATH_TO_IPCAMLIST_IPCAM: 'http://versioncheck.bluecherrydvr.com/ipcam.csv',
  VAR_PATH_TO_IPCAMLIST_DRIVER: 'http://versioncheck.bluecherrydvr.com/ipcamdriver.csv',
  VAR_PATH_TO_IPCAMLIST_PTZ: 'http://versioncheck.bluecherrydvr.com/ipcamptz.csv',

  VAR_TARRED_LOGS_TMP_LOCATION: '/tmp/bc-logs.tar', // before logs are downloaded they will be compressed to this file
  VAR_MYSQLDUMP_TMP_LOCATION: '/tmp/bluecherry-backup.tgz',

  VAR_PATH_TO_IPCAMLIST_UPDATE: 'http://versioncheck.bluecherrydvr.com/ipcamlistupdate.php',
  VAR_IPCAMLIST_UPDATE_TOKEN: 'Hiuhg3TnbJl1676T',

  RM_CLIENT_DOWNLOAD: 'http://www.bluecherrydvr.com/downloads',

  VAR_LICENSE_AUTH: 'http://keycheck.bluecherrydvr.com',

  // LexActivator status code
  LA_OK: 0,
  LA_FAIL: 1,
  LA_EXPIRED: 20,
  LA_SUSPENDED: 21,
  LA_GRACE_PERIOD_OVER: 22,
  LA_TRIAL_EXPIRED: 25,
  LA_LOCAL_TRIAL_EXPIRED: 26,
  LA_RELEASE_UPDATE_AVAILABLE: 30,
  LA_RELEASE_NO_UPDATE_AVAILABLE: 31,
  LA_E_FILE_PATH: 40,
  LA_E_PRODUCT_FILE: 41,
  LA_E_PRODUCT_DATA: 42,
  LA_E_PRODUCT_ID: 43,
  LA_E_SYSTEM_PERMISSION: 44,
  LA_E_FILE_PERMISSION: 45,
  LA_E_WMIC: 46,
  LA_E_TIME: 47,
  LA_E_INET: 48,
  LA_E_NET_PROXY: 49,
  LA_E_HOST_URL: 50,
  LA_E_BUFFER_SIZE: 51,
  LA_E_APP_VERSION_LENGTH: 52,
  LA_E_REVOKED: 53,
  LA_E_LICENSE_KEY: 54,
  LA_E_LICENSE_TYPE: 55,
  LA_E_OFFLINE_RESPONSE_FILE: 56,
  LA_E_OFFLINE_RESPONSE_FILE_EXPIRED: 57,
  LA_E_ACTIVATION_LIMIT: 58,
  LA_E_ACTIVATION_NOT_FOUND: 59,
  LA_E_DEACTIVATION_LIMIT: 60,
  LA_E_TRIAL_NOT_ALLOWED: 61,
  LA_E_TRIAL_ACTIVATION_LIMIT: 62,
  LA_E_MACHINE_FINGERPRINT: 63,
  LA_E_METADATA_KEY_LENGTH: 64,
  LA_E_METADATA_VALUE_LENGTH: 65,
  LA_E_ACTIVATION_METADATA_LIMIT: 66,
  LA_E_TRIAL_ACTIVATION_METADATA_LIMIT: 67,
  LA_E_METADATA_KEY_NOT_FOUND: 68,
  LA_E_TIME_MODIFIED: 69,
  LA_E_RELEASE_VERSION_FORMAT: 70,
  LA_E_AUTHENTICATION_FAILED: 71,
  LA_E_METER_ATTRIBUTE_NOT_FOUND: 72,
  LA_E_METER_ATTRIBUTE_USES_LIMIT_REACHED: 73,
  LA_E_CUSTOM_FINGERPRINT_LENGTH: 74,
  LA_E_VM: 80,
  LA_E_COUNTRY: 81,
  LA_E_IP: 82,
  LA_E_RATE_LIMIT: 90,
  LA_E_SERVER: 91,
  LA_E_CLIENT: 92,

  // License Command
  LA_IS_ACTIVATED: 'bc_v3_license_isActivated',
  LA_IS_LICENSE_GENUINE: 'bc_v3_license_isLicenseGenuine',
  LA_IS_TRIAL_GENUINE: 'bc_v3_license_IsTrialGenuine',
  LA_GET_LICENSE_METADATA: 'bc_v3_license_GetLicenseMetadata',
  LA_GET_LICENSE_EXPIRYDATE: 'bc_v3_license_GetLicenseExpiryDate',
  LA_GET_TRIAL_EXPIRYDATE: 'bc_v3_license_GetTrialExpiryDate',
  LA_ACTIVATE_LICENSE: 'bc_v3_license_ActivateLicense',
  LA_ACTIVATE_TRIAL: 'bc_v3_license_ActivateTrial',
  LA_DEACTIVATE_LICENSE: 'bc_v3_license_DeactivateLicense',

  // License Other
  NO_LICENSE_DEFAULT_ALLOWED: 4,
};

module.exports = constants;
