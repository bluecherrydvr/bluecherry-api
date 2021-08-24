const nodemailer = require('nodemailer');
const Utils = require('../services/util.service');

const MailService = () => {
  const utils = Utils();
  // eslint-disable-next-line consistent-return
  const sendMail = async (email, emailBody, isTestMail) => new Promise(async (resolve, reject) => {
    try {
      const globalSetting = await utils.getAllGlobalSetting();
      const smtp = globalSetting.G_SMTP_SERVICE;
      const G_TEST_EMAIL_BODY = 'TEST EMAIL';
      let body = null;
      if (isTestMail) {
        body = `${G_TEST_EMAIL_BODY} from ${globalSetting.G_DVR_NAME}`;
      } else {
        body = emailBody;
      }

      let transporter = null;
      if (smtp === 'default') {
        transporter = nodemailer.createTransport({
          sendmail: true,
          newline: 'unix',
          path: '/usr/sbin/sendmail',
        });
      } else if (smtp === 'smtp') {
        transporter = nodemailer.createTransport({
          host: globalSetting.G_SMTP_HOST,
          port: globalSetting.G_SMTP_PORT,
          secure: globalSetting.G_SMTP_SSL === 'ssl' || globalSetting.G_SMTP_SSL === 'tls', // upgrade later with STARTTLS
          auth: {
            user: globalSetting.G_SMTP_USERNAME,
            pass: globalSetting.G_SMTP_PASSWORD,
          },
          tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false,
          },
        });
      }

      if (transporter) {
        transporter.sendMail({
          from: globalSetting.G_SMTP_EMAIL_FROM,
          to: email,
          subject: G_TEST_EMAIL_BODY,
          text: body,
        }, (err, info) => {
          if (err) {
            return reject(err);
          }
          console.log({
            info,
          });
          return resolve(info);
        });
      }
    } catch (e) {
      return reject(e);
    }
  });

  return {
    sendMail,
  };
};

module.exports = MailService;
