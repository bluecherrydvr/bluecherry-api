// const bcrypt = require('bcrypt-nodejs');
const md5 = require('md5');

const bcryptService = (salt) => {
  const password = (user) => {
    const hash = md5(`${user.password}${salt}`);

    return hash;
  };

  const comparePassword = (pw, hash) => (
    // bcrypt.compareSync(pw, hash);
    md5(`${pw}`) === hash
  );

  return {
    password,
    comparePassword,
  };
};

module.exports = bcryptService;
