const Licenses = require('../models/Licenses');
const bcLicenseWrapper = require('../services/bcLicenseWrapper.service');
const { LexStatusCodes } = require('@cryptlex/lexactivator');

const LicensesController = () => {
  const getLicenses = async (req, res) => {
    try {
      const licenses = await Licenses.findAll();

      return res.status(200).json({ licenses });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const addLicenses = async (req, res) => {
    try {
      const { licenseCode } = req.body;

      if (!licenseCode) {
        return res.status(404).json({ msg: 'License key is required' });
      }
      // let licenses = await Licenses
      //   .findOne({
      //     where: {
      //       license: licenseCode,
      //     },
      //   });
      //
      // licenses = licenses && licenses.toJSON();
      //
      // if (!licenses || !licenses.licenses) {
      //   return res.status(500).json({ msg: req.t('L_LA_E_LICENSE_KEY') });
      // }

      const status = await bcLicenseWrapper.activateLicenses(licenseCode, req.t);
      await Licenses.upsert(
        {
          license: licenseCode,
          added: Math.floor(new Date() / 1000),
          authorization: '',
        },
        {
          license: licenseCode,
        },
      );

      console.log({ status });
      if (status.status) {
        return res.status(200).json({ msg: status.msg });
      }

      return res.status(400).json({ ...status });
    } catch (err) {
      console.log({
        err,
      });
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const deactivateLicenses = async (req, res) => {
    try {
      const { license } = req.body;

      if (!license) {
        return res.status(404).json({ msg: 'License key is required' });
      }

      let status = await await bcLicenseWrapper.DeactivateLicense();
      let msg;
      if (LexStatusCodes.LA_OK !== status) {
        msg = bcLicenseWrapper.getLicenseStatusMessage(status);
        return res.status(200).json({ msg, status });
      }

      try {
        await Licenses.destroy({
          where: {
            license,
          },
        });
        msg = req.t('L_LICENSE_DEACTIVATED');
      } catch (e) {
        msg = req.t('L_LICENSE_DEACTIVATED_DB_FAIL');
      }
      status = await bcLicenseWrapper.bcLicenseCheckGenuine(req.t);

      return res.status(200).json({ msg, status });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const activateTrial = async (req, res) => {
    try {
      const status = await bcLicenseWrapper.IsTrialGenuine(req.t);

      if (status.status) {
        const trialExpiryDate = await bcLicenseWrapper.GetTrialExpiryDate();
        if (trialExpiryDate > 0) {
          // To calculate the time difference of two dates
          const DifferenceInTime = (trialExpiryDate * 1000) - new Date().getTime();

          // To calculate the no. of days between two dates
          const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
          return res.status(200).json({ msg: `${req.t('L_LA_E_TRIAL_ACTIVATED')}${Math.floor(DifferenceInDays)}` });
        }
      }

      await bcLicenseWrapper.activateTrial(req.t);
      return res.status(200).json({ msg: req.t('L_LA_E_LICENSE_ACTIVATED'), status });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const isTrialActive = async (req, res) => {
    try {
      const status = await bcLicenseWrapper.IsTrialGenuine(req.t);

      if (status.status) {
        const trialExpiryDate = await bcLicenseWrapper.GetTrialExpiryDate();
        if (trialExpiryDate > 0) {
          // To calculate the time difference of two dates
          const DifferenceInTime = (trialExpiryDate * 1000) - new Date().getTime();

          // To calculate the no. of days between two dates
          const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
          return res.status(200).json({ msg: `${req.t('L_LA_E_TRIAL_ACTIVATED')}${Math.floor(DifferenceInDays)}` });
        }
      }

      return res.status(404).json({ msg: 'Trial in not active' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const IsLicenseGenuine = async (req, res) => {
    try {
      const status = await bcLicenseWrapper.bcLicenseCheckGenuine(req.t);

      if (status.status) {
        return res.status(200).json({ msg: status.msg });
      }

      return res.status(404).json({ msg: 'License in not active' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };


  return {
    getLicenses,
    addLicenses,
    deactivateLicenses,
    activateTrial,
    isTrialActive,
    IsLicenseGenuine,
  };
};

module.exports = LicensesController;
