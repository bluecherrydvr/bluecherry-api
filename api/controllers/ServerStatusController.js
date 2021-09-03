/* eslint-disable no-tabs */
const ServerStatus = require('../models/ServerStatus');
const osInfo = require('../services/cpuinfo');

const ServerStatusController = () => {
  const getAll = async (req, res) => {
    try {
      const users = await ServerStatus.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const getServerStatus = async (req, res) => {
    try {
      let serverData = await ServerStatus.findOne();
      serverData = serverData.toJSON();

      const memory = await osInfo.mem();
      const cpu = await osInfo.cpu();
      // const disk = await osInfo.disk();
      const uptime = await osInfo.uptime();
      const isServerRunning = await osInfo.isServerRunning();
      // console.log({ disk, uptime, cpu, memory, isServerRunning });
      const xmlResponse = `<?xml version="1.0" encoding="ISO-8859-1"?>
<stats>
	<cpu-usage>${parseFloat(cpu).toFixed(2)}</cpu-usage>
	<memory-total>${memory.memoryTotal}</memory-total>
	<memory-inuse>${memory.memoryActive}</memory-inuse>
	<memory-used-percentage>${parseFloat(memory.memoryUsedPercentage * 100).toFixed(2)}</memory-used-percentage>
	<bc-server-running>${isServerRunning ? 'up' : 'down'}</bc-server-running>
	<server-uptime>${uptime}</server-uptime>
	<server-status>
		<pid>${serverData.pid}</pid>
		<timestamp>${serverData.timestamp}</timestamp>
		<message>${serverData.message}</message>
	</server-status>
</stats>
`;
      // console.log({ xmlResponse, users: serverData });
      res.set('Content-Type', 'text/xml');
      return res.send(xmlResponse);
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };


  return {
    getAll,
    getServerStatus,
  };
};

module.exports = ServerStatusController;
