/* eslint-disable no-param-reassign */
const { curly } = require('node-libcurl');
const GlobalSettings = require('../models/GlobalSettings');
const Licenses = require('../models/Licenses');
const Utils = require('./util.service');

const subdomainproviderbase = () => {
  const API_BASE_URL_NAME = 'G_SUBDOMAIN_API_BASE_URL';
  let subdomainApiBaseUrlCache = null;
  const utils = Utils();
  const getNotImplementedResponse = async () => ({
    success: false,
    message: 'this request method is not implemented',
  });

  const getSubdomainApiBaseUrl = async () => {
    try {
      if (!subdomainApiBaseUrlCache) {
        return subdomainApiBaseUrlCache;
      }

      const data = await GlobalSettings.findOne({ where: { parameter: API_BASE_URL_NAME } });
      subdomainApiBaseUrlCache = data.toJSON();
      return subdomainApiBaseUrlCache;
    } catch (e) {
      return null;
    }
  };

  const getLicenseKey = async () => {
    try {
      let licenses = await Licenses.findOne({ where: {} });
      licenses = licenses.toJSON();

      if (!licenses || !licenses.licenses) {
        return utils.throwError(500, "Any license isn't activated  in bluecherry system");
      }

      return licenses.licenses;
    } catch (e) {
      return utils.throwError(500, "Any license isn't activated  in bluecherry system");
    }
  };

  const postToApi = async (path, body = {}, httpHeader = []) => {
    try {
      const baseUrl = getSubdomainApiBaseUrl();
      const { data } = await curly.post(`${baseUrl}${path}`, {
        postFields: JSON.stringify(body),
        httpHeader: [
          'Content-Type: application/json',
          ...httpHeader,
        ],
      });
      return data;
    } catch (e) {
      return utils.throwError(500, 'API request is failed.');
    }
  };

  const getLicenseId = async () => {
    let licenseKey;
    try {
      licenseKey = await getLicenseKey();
      const result = await postToApi('/get-license-id', { licenseKey });

      if (!result.success) {
        return utils.throwError(500, `${licenseKey}'s id not found in cryptlex`);
      }


      return result.licenseId;
    } catch (e) {
      return utils.throwError(500, `${licenseKey}'s id not found in cryptlex`);
    }
  };

  const postToApiWithToken = async (path, body, headers = [], tokenOptional = false) => {
    let licenseKey;
    try {
      try {
        licenseKey = await getLicenseKey();
      } catch (e) {
        if (tokenOptional) {
          return postToApi(path, body, headers);
        }
        return utils.throwError(500, e);
      }

      return postToApi(path, body, [`Authorization: Bearer  ${licenseKey}`, ...headers]);
    } catch (e) {
      return utils.throwError(500, `${licenseKey}'s id not found in cryptlex`);
    }
  };

  const executeApiGetRequest = async (url, httpHeader = [], customRequest = null) => {
    try {
      const { data } = await curly.get(url, {
        httpHeader: [
          'Content-Type: application/json',
          ...httpHeader,
        ],
        customRequest,
      });
      return data;
    } catch (e) {
      return utils.throwError(500, 'API request is failed.');
    }
  };

  const getFromApi = async (path, query = {}, headers = [], customRequest = null) => {
    try {
      const baseUrl = getSubdomainApiBaseUrl();

      if (!query) {
        const params = new URLSearchParams(query);
        const str = params.toString();
        path += `?${str}`;
      }
      return executeApiGetRequest(`${baseUrl}${path}`, headers, customRequest);
    } catch (e) {
      return utils.throwError(500, 'API request is failed.');
    }
  };

  // eslint-disable-next-line max-len
  const getFromApiWithToken = async (path, query = {}, headers = [], tokenOptional = false, customRequest = null) => {
    let licenseId;
    try {
      try {
        licenseId = getLicenseId();
      } catch (e) {
        if (tokenOptional) {
          return getFromApi(path, query, headers);
        }
        return utils.throwError(500, e);
      }
      return getFromApi(path, query, [`Authorization: Bearer ${licenseId}`, ...headers], customRequest);
    } catch (e) {
      return utils.throwError(500, 'API request is failed.');
    }
  };

  const getServerPublicIp = async (tryIpv6) => executeApiGetRequest(`https://${tryIpv6 ? 'api64' : 'api'}ipify.org/?format=json`);

  const getGlobalSettingsValue = async (parameter) => {
    try {
      let data = await GlobalSettings.findOne({ where: { parameter } });
      data = data.toJSON();

      if (data && data.value) {
        return data.value;
      }
      return await GlobalSettings.create({
        parameter,
        value: null,
      });
    } catch (e) {
      return null;
    }
  };

  const setGlobalSettingsValue = async (parameter, value) => {
    try {
      const data = await GlobalSettings.findOne({ where: { parameter } });
      value = value ? escape(value) : null;
      data.value = value;
      await data.save();
      return data;
    } catch (e) {
      return null;
    }
  };

  return {
    getNotImplementedResponse,
    getSubdomainApiBaseUrl,
    getLicenseKey,
    getLicenseId,
    postToApi,
    postToApiWithToken,
    executeApiGetRequest,
    getFromApi,
    getFromApiWithToken,
    getServerPublicIp,
    getGlobalSettingsValue,
    setGlobalSettingsValue,
  };
};

module.exports = subdomainproviderbase();
