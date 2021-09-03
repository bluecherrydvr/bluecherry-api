/* eslint-disable */
const Utils = require('../services/util.service');
const subdomainProviderBase = require('../services/subdomainProviderBase.service');

const SubdomainProviderController = () => {
  const utils = Utils();

  const getData = async (req, res) => {
    try {

      const settings = await utils.getAllGlobalSetting();
      const data = {
        actualSubdomain : '',
        actualEmail : settings.G_SUBDOMAIN_EMAIL_ACCOUNT,
        actualIpv4Value : '',
        actualIpv6Value : '',
        autoUpdateIpv4 : settings.G_SUBDOMAIN_AUTO_UPDATE_IPV4,
        autoUpdateIpv6 : settings.G_SUBDOMAIN_AUTO_UPDATE_IPV6,
        licenseIdExists : false
      }

      try {
        await subdomainProviderBase.getLicenseKey();
      } catch (e) {
        data.licenseIdExists = false;
        return res.status(200).json({ data });
      }

      data.licenseIdExists = true;

      // Call '/actual-configuration' api
      let actualConfig;
      try {
        actualConfig = await subdomainProviderBase.getFromApiWithToken('/actual-configuration');
      } catch (error) {
        return res.status(200).json({ data });
      }

      if (actualConfig) {
        data.actualSubdomain = actualConfig.subdomain;

        for (const record of actualConfig.records) {
          switch (record.type) {
            case 'a': data.actualIpv4Value = record.value; break;
            case 'aaaa' : data.actualIpv6Value = record.value; break;
          }
        }
      }

      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const postData = async (req, res) => {
    try {

      let status = 0;
      const {
        subdomain_name,
        subdomain_email,
        server_ip_address_4,
        server_ip_address_6,
        update_ip_address_4_auto,
        update_ip_address_6_auto,
      } = req.body;

      if (!subdomain_name) {
        return res.status(500).json({ msg: 'subdomain_name is required' });
      }
      if (!subdomain_email) {
        return res.status(500).json({ msg: 'subdomain_email is required' });
      }
      if (!server_ip_address_4) {
        return res.status(500).json({ msg: 'server_ip_address_4 is required' });
      }
      if (!server_ip_address_6) {
        return res.status(500).json({ msg: 'server_ip_address_6 is required' });
      }

      await subdomainProviderBase.setGlobalSettingsValue('G_SUBDOMAIN_AUTO_UPDATE_IPV4',
          !update_ip_address_4_auto ? 0 : 1);

      await subdomainProviderBase.setGlobalSettingsValue('G_SUBDOMAIN_AUTO_UPDATE_IPV6',
          !update_ip_address_6_auto ? 0 : 1);

      try {
        let result = await subdomainProviderBase.postToApiWithToken('/assign-ip-address', {
          'subdomain': subdomain_name,
          'ip_address' : server_ip_address_4,
          'type': 4
        });

        if (!result.success) {
          status = 0;
          return res.status(200).json({status});
        }

        await subdomainProviderBase.setGlobalSettingsValue('G_SUBDOMAIN_AUTO_UPDATE_IPV4_VALUE', server_ip_address_4);

        if (!server_ip_address_6) {
          result = await subdomainProviderBase.postToApiWithToken('/assign-ip-address', {
            'subdomain': subdomain_name,
            'ip_address': server_ip_address_6,
            'type': 6
        });

          if (!result.success) {
            status = 0;
            return res.status(200).json({status});
          }

          await subdomainProviderBase.setGlobalSettingsValue('G_SUBDOMAIN_AUTO_UPDATE_IPV6_VALUE', server_ip_address_6);
        }

      } catch (error) {
        status = 0;
        return res.status(200).json({status});
      }

      // Update subdomain certs
      let token = await subdomainProviderBase.getLicenseId();

      const returnVar = await utils.execPromise(`sudo -b /usr/share/bluecherry/scripts/update_subdomain_certs.sh ${subdomain_name} ${subdomain_email} ${token}`);

      if (returnVar === 0) {
        await subdomainProviderBase.setGlobalSettingsValue('G_SUBDOMAIN_EMAIL_ACCOUNT', subdomain_email);
        status = 1;
        return res.status(200).json({status});
      }

      await subdomainProviderBase.setGlobalSettingsValue('G_SUBDOMAIN_EMAIL_ACCOUNT', subdomain_email);
      status = 3;

      return res.status(200).json({status});
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const querySubdomainName = async (name) => await subdomainProviderBase.postToApiWithToken('/check-subdomain-availability', {
    'subdomain' : name
  }, []);

  const querySubdomain = async (req, res) => {
    try{
      const { name } = req.query;
      const data = await querySubdomainName(name);

      return res.status(200).json({...data});
    } catch (e) {
      return res.status(500).json({ msg: e.message , errorType: e.errorType });
    }
  }

  const getIp = async (req, res) => {
    try{
      const { ipv6 } = req.query;
      const data = await subdomainProviderBase.getServerPublicIp(ipv6 === 'true' || ipv6 === 1);

      return res.status(200).json({...data});
    } catch (e) {
      return res.status(500).json({ msg: e.message , errorType: e.errorType });
    }
  }

  const removeProvider = async (req, res) => {
    try {
      const actualConfig = await subdomainProviderBase.deleteFromApiWithToken('/actual-configuration', {}, [], false, 'DELETE');

      if (actualConfig && actualConfig.success) {
        await subdomainProviderBase.setGlobalSettingsValue('G_SUBDOMAIN_AUTO_UPDATE_IPV4', 0);
        await subdomainProviderBase.setGlobalSettingsValue('G_SUBDOMAIN_AUTO_UPDATE_IPV6', 0);
      }

      return res.status(200).json({ actualConfig });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  }

  return {
    getData,
    postData,
    querySubdomain,
    getIp,
    removeProvider
  };
};

module.exports = SubdomainProviderController;
