/* eslint-disable no-param-reassign,max-len */
const {
  LexActivator,
  LexStatusCodes,
  PermissionFlags,
} = require('@cryptlex/lexactivator');
const { machineIdSync } = require('node-machine-id');
const Utils = require('./util.service');
const bcLicensesConfig = require('../../config/bcLicenses');

const bcLicenseWrapper = () => {
  const utils = Utils();
  const machineId = machineIdSync({ original: true });
  LexActivator.SetProductData(bcLicensesConfig.PRODUCT_DATA);
  LexActivator.SetProductId(bcLicensesConfig.PRODUCT_ID, PermissionFlags.LA_USER);

  const bcLicenseMachineId = async () => {
    try {
      const returnVar = await utils.execPromise('/usr/lib/bluecherry/licensecmd bc_license_machine_id');
      return returnVar[0];
    } catch (e) {
      return false;
    }
  };

  const getLicenseStatusMessage = (status, t) => {
    let message = t('L_LA_OK');

    switch (status) {
      case LexStatusCodes.LA_OK:
        message = t('L_LA_OK');
        break;
      case LexStatusCodes.LA_FAIL:
        message = t('L_LA_FAIL');
        break;
      case LexStatusCodes.LA_EXPIRED:
        message = t('L_LA_EXPIRED');
        break;
      case LexStatusCodes.LA_SUSPENDED:
        message = t('L_LA_SUSPENDED');
        break;
      case LexStatusCodes.LA_GRACE_PERIOD_OVER:
        message = t('L_LA_GRACE_PERIOD_OVER');
        break;
      case LexStatusCodes.LA_TRIAL_EXPIRED:
        message = t('L_LA_TRIAL_EXPIRED');
        break;
      case LexStatusCodes.LA_LOCAL_TRIAL_EXPIRED:
        message = t('L_LA_LOCAL_TRIAL_EXPIRED');
        break;
      case LexStatusCodes.LA_RELEASE_UPDATE_AVAILABLE:
        message = t('L_LA_RELEASE_UPDATE_AVAILABLE');
        break;
      case LexStatusCodes.LA_RELEASE_NO_UPDATE_AVAILABLE:
        message = t('L_LA_RELEASE_NO_UPDATE_AVAILABLE');
        break;
      case LexStatusCodes.LA_E_FILE_PATH:
        message = t('L_LA_E_FILE_PATH');
        break;
      case LexStatusCodes.LA_E_PRODUCT_FILE:
        message = t('L_LA_E_PRODUCT_FILE');
        break;
      case LexStatusCodes.LA_E_PRODUCT_DATA:
        message = t('L_LA_E_PRODUCT_DATA');
        break;
      case LexStatusCodes.LA_E_PRODUCT_ID:
        message = t('L_LA_E_PRODUCT_ID');
        break;
      case LexStatusCodes.LA_E_SYSTEM_PERMISSION:
        message = t('L_LA_E_SYSTEM_PERMISSION');
        break;
      case LexStatusCodes.LA_E_FILE_PERMISSION:
        message = t('L_LA_E_FILE_PERMISSION');
        break;
      case LexStatusCodes.LA_E_WMIC:
        message = t('L_LA_E_WMIC');
        break;
      case LexStatusCodes.LA_E_TIME:
        message = t('L_LA_E_TIME');
        break;
      case LexStatusCodes.LA_E_INET:
        message = t('L_LA_E_INET');
        break;
      case LexStatusCodes.LA_E_NET_PROXY:
        message = t('L_LA_E_NET_PROXY');
        break;
      case LexStatusCodes.LA_E_HOST_URL:
        message = t('L_LA_E_HOST_URL');
        break;
      case LexStatusCodes.LA_E_BUFFER_SIZE:
        message = t('L_LA_E_BUFFER_SIZE');
        break;
      case LexStatusCodes.LA_E_APP_VERSION_LENGTH:
        message = t('L_LA_E_APP_VERSION_LENGTH');
        break;
      case LexStatusCodes.LA_E_REVOKED:
        message = t('L_LA_E_REVOKED');
        break;
      case LexStatusCodes.LA_E_LICENSE_KEY:
        message = t('L_LA_E_LICENSE_KEY');
        break;
      case LexStatusCodes.LA_E_LICENSE_TYPE:
        message = t('L_LA_E_LICENSE_TYPE');
        break;
      case LexStatusCodes.LA_E_OFFLINE_RESPONSE_FILE:
        message = t('L_LA_E_OFFLINE_RESPONSE_FILE');
        break;
      case LexStatusCodes.LA_E_OFFLINE_RESPONSE_FILE_EXPIRED:
        message = t('L_LA_E_OFFLINE_RESPONSE_FILE_EXPIRED');
        break;
      case LexStatusCodes.LA_E_ACTIVATION_LIMIT:
        message = t('L_LA_E_ACTIVATION_LIMIT');
        break;
      case LexStatusCodes.LA_E_ACTIVATION_NOT_FOUND:
        message = t('L_LA_E_ACTIVATION_NOT_FOUND');
        break;
      case LexStatusCodes.LA_E_DEACTIVATION_LIMIT:
        message = t('L_LA_E_DEACTIVATION_LIMIT');
        break;
      case LexStatusCodes.LA_E_TRIAL_NOT_ALLOWED:
        message = t('L_LA_E_TRIAL_NOT_ALLOWED');
        break;
      case LexStatusCodes.LA_E_TRIAL_ACTIVATION_LIMIT:
        message = t('L_LA_E_TRIAL_ACTIVATION_LIMIT');
        break;
      case LexStatusCodes.LA_E_MACHINE_FINGERPRINT:
        message = t('L_LA_E_MACHINE_FINGERPRINT');
        break;
      case LexStatusCodes.LA_E_METADATA_KEY_LENGTH:
        message = t('L_LA_E_METADATA_KEY_LENGTH');
        break;
      case LexStatusCodes.LA_E_METADATA_VALUE_LENGTH:
        message = t('L_LA_E_METADATA_VALUE_LENGTH');
        break;
      case LexStatusCodes.LA_E_ACTIVATION_METADATA_LIMIT:
        message = t('L_LA_E_ACTIVATION_METADATA_LIMIT');
        break;
      case LexStatusCodes.LA_E_TRIAL_ACTIVATION_METADATA_LIMIT:
        message = t('L_LA_E_TRIAL_ACTIVATION_METADATA_LIMIT');
        break;
      case LexStatusCodes.LA_E_METADATA_KEY_NOT_FOUND:
        message = t('L_LA_E_METADATA_KEY_NOT_FOUND');
        break;
      case LexStatusCodes.LA_E_TIME_MODIFIED:
        message = t('L_LA_E_TIME_MODIFIED');
        break;
      case LexStatusCodes.LA_E_RELEASE_VERSION_FORMAT:
        message = t('L_LA_E_RELEASE_VERSION_FORMAT');
        break;
      case LexStatusCodes.LA_E_AUTHENTICATION_FAILED:
        message = t('L_LA_E_AUTHENTICATION_FAILED');
        break;
      case LexStatusCodes.LA_E_METER_ATTRIBUTE_NOT_FOUND:
        message = t('L_LA_E_METER_ATTRIBUTE_NOT_FOUND');
        break;
      case LexStatusCodes.LA_E_METER_ATTRIBUTE_USES_LIMIT_REACHED:
        message = t('L_LA_E_METER_ATTRIBUTE_USES_LIMIT_REACHED');
        break;
      case LexStatusCodes.LA_E_CUSTOM_FINGERPRINT_LENGTH:
        message = t('L_LA_E_CUSTOM_FINGERPRINT_LENGTH');
        break;
      case LexStatusCodes.LA_E_VM:
        message = t('L_LA_E_VM');
        break;
      case LexStatusCodes.LA_E_COUNTRY:
        message = t('L_LA_E_COUNTRY');
        break;
      case LexStatusCodes.LA_E_IP:
        message = t('L_LA_E_IP');
        break;
      case LexStatusCodes.LA_E_RATE_LIMIT:
        message = t('L_LA_E_RATE_LIMIT');
        break;
      case LexStatusCodes.LA_E_SERVER:
        message = t('L_LA_E_SERVER');
        break;
      case LexStatusCodes.LA_E_CLIENT:
        message = t('L_LA_E_CLIENT');
        break;
      default:
        message = t('L_LA_E_UNKNOWN');
    }
    return message;
  };

  const bcLicenseCommand = async () => {
    try {
      LexActivator.SetActivationMetadata('key1', 'value1');
      const status = LexActivator.ActivateLicense();
      if (LexStatusCodes.LA_OK === status) {
        console.log('License activated successfully!');
      } else if (LexStatusCodes.LA_EXPIRED === status) {
        console.log('License activated successfully but has expired!');
      } else if (LexStatusCodes.LA_SUSPENDED === status) {
        console.log('License activated successfully but has been suspended!');
      }
      return status;
    } catch (error) {
      console.log('License activated failed:', error.code, error.message);
      return error;
    }
  };
  const activateTrial = async (t) => {
    try {
      const data = {
        status: false,
        msg: '',
      };
      const status = LexActivator.ActivateTrial();
      data.status = LexStatusCodes.LA_OK === status;
      data.msg = getLicenseStatusMessage(status, t);
      return data;
    } catch (error) {
      console.log('License activated failed:', error.code, error.message);
      return error;
    }
  };

  const activateLicenses = async (key, t) => {
    try {
      const data = {
        status: false,
        msg: '',
      };
      LexActivator.SetLicenseKey(key);
      const status = LexActivator.ActivateLicense();
      data.status = LexStatusCodes.LA_OK === status;
      data.msg = getLicenseStatusMessage(status, t);
      return data;
    } catch (error) {
      console.log('License activated failed:', error.code, error.message);
      return error;
    }
  };

  const IsTrialGenuine = async (t) => {
    try {
      const status = LexActivator.IsTrialGenuine();

      return {
        status: LexStatusCodes.LA_OK === status,
        msg: getLicenseStatusMessage(status, t),
      };
    } catch (error) {
      console.log('License activated failed:', error.code, error.message);
      return error;
    }
  };

  const IsLicenseGenuine = async () => {
    try {
      return LexActivator.IsLicenseGenuine();
    } catch (e) {
      return false;
    }
  };

  const GetTrialExpiryDate = async () => {
    try {
      return LexActivator.GetTrialExpiryDate();
    } catch (e) {
      return false;
    }
  };
  const DeactivateLicense = async () => {
    try {
      return LexActivator.DeactivateLicense();
    } catch (e) {
      return false;
    }
  };

  const bcIsTrialGenuine = async (t) => {
    try {
      const status = LexActivator.IsTrialGenuine();
      if (LexStatusCodes.LA_OK === status) {
        const trialExpiryDate = await GetTrialExpiryDate();
        if (trialExpiryDate > 0) {
          // To calculate the time difference of two dates
          const DifferenceInTime = (trialExpiryDate * 1000) - new Date().getTime();

          // To calculate the no. of days between two dates
          const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
          return {
            status: true,
            msg: `${t('L_LA_E_TRIAL_ACTIVATED')}${Math.floor(DifferenceInDays)}`,
          };
        }
      }

      return {
        status: false,
        msg: 'Trial in not active',
      };
    } catch (e) {
      return {
        status: false,
        msg: 'Trial in not active',
      };
    }
  };

  const bcLicenseCheckGenuine = async (t) => {
    try {
      let status = IsLicenseGenuine();
      let licenceStatus;

      const data = {
        status: false,
        msg: '',
      };

      switch (status) {
        case LexStatusCodes.LA_OK:
          try {
            licenceStatus = LexActivator.GetLicenseExpiryDate();

            if (licenceStatus === 0) {
              data.msg = t('LA_EXPIRED');
            }
            data.status = true;
            data.msg = 'Licence is active';
          } catch (e) {
            data.msg = t('L_LA_E_BC_SERVER');
          }
          break;
        case LexStatusCodes.LA_EXPIRED:
          data.msg = t('LA_EXPIRED');
          break;
        case LexStatusCodes.LA_SUSPENDED:
          data.msg = t('LA_SUSPENDED');
          break;
        case LexStatusCodes.LA_GRACE_PERIOD_OVER:
          data.msg = t('LA_GRACE_PERIOD_OVER');
          break;
        default:
          status = bcIsTrialGenuine(t);
          break;
      }

      return status;
    } catch (e) {
      return false;
    }
  };

  return {
    machineId,
    bcLicenseMachineId,
    bcLicenseCommand,
    activateTrial,
    IsTrialGenuine,
    IsLicenseGenuine,
    GetTrialExpiryDate,
    bcIsTrialGenuine,
    bcLicenseCheckGenuine,
    activateLicenses,
    DeactivateLicense,
    getLicenseStatusMessage,
  };
};

module.exports = bcLicenseWrapper();
