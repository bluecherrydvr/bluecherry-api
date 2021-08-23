/* eslint-disable no-param-reassign,no-mixed-operators,no-plusplus,guard-for-in,no-restricted-syntax,max-len */
const os = require('os');
const fs = require('fs');
const { exec } = require('node-exec-promise');
const si = require('systeminformation');
const checkDiskSpace = require('check-disk-space').default;

const rootPath = os.platform() === 'win32' ? 'c:' : '/';

const cpuAverage = () => {
  let totalIdle = 0;
  let totalTick = 0;
  const cpus = os.cpus();
  for (let i = 0, len = cpus.length; i < len; i++) {
    const cpu = cpus[i];

    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  }
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
};

const arrAvg = (arr) => {
  if (arr && arr.length >= 1) {
    const sumArr = arr.reduce((a, b) => a + b, 0);
    return sumArr / arr.length;
  }
  return 0;
};

const getCPULoadAVG = (avgTime = 1000, delay = 100) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-bitwise
  const n = ~~(avgTime / delay);
  if (n <= 1) {
    // eslint-disable-next-line prefer-promise-reject-errors
    reject('Error: interval too small');
  }
  let i = 0;
  const samples = [];
  const avg1 = cpuAverage();
  const interval = setInterval(() => {
    if (i >= n) {
      clearInterval(interval);
      resolve(((arrAvg(samples) * 100)));
    }
    const avg2 = cpuAverage();
    const totalDiff = avg2.total - avg1.total;
    const idleDiff = avg2.idle - avg1.idle;
    samples[i] = (1 - idleDiff / totalDiff);
    i++;
  }, delay);
});

exports.cpu = async () => {
  const avg = await getCPULoadAVG(1000, 100);
  return avg / 100;
};

exports.mem = async () => {
  const mem = await si.mem();
  const memoryUsage = mem.active / mem.total;
  return {
    memoryActive: mem.active,
    memoryTotal: mem.total,
    memoryUsedPercentage: (memoryUsage * 100) / 100,
  };
};

exports.disk = async () => {
  const diskSpace = await checkDiskSpace(rootPath);
  const used = diskSpace.size - diskSpace.free;
  return (used / diskSpace.size * 100) / 100;
};

// eslint-disable-next-line no-extend-native
Number.prototype.zeroPad = function (length) {
  length = length || 2; // defaults to 2 if no parameter is passed
  return (new Array(length).join('0') + this).slice(length * -1);
};

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' day(s), ') : '';
  const hDisplay = h > 0 ? `${h.zeroPad()}:` : '';
  const mDisplay = m > 0 ? `${m.zeroPad()}:` : '';
  const sDisplay = s > 0 ? s.zeroPad() : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

exports.uptime = () => {
  try {
    const data = fs.readFileSync('/proc/uptime', 'utf8');
    // const data = '2958818.21 2928140.36';
    const tmp = data.split(' ');
    // let dd = (round(tmp[0])<86400 || round(tmp[0])>= 172800) ? " \d\a\y\s " : " \d\a\y ";
    return secondsToDhms(tmp[0]);
  } catch (err) {
    console.error(err);
    return '';
  }
};

exports.isServerRunning = () => {
  try {
    return new Promise((resolve) => {
      exec('pidof bc-server').then((out) => {
        resolve(!!out.stdout);
      }, (err) => {
        console.error(err);
        return resolve(false);
      });
    });
    // return true;
    // return !!(exec('pidof bc-server'));
  } catch (err) {
    return false;
  }
};
