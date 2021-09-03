/* eslint-disable */
const { QueryTypes } = require('sequelize');
const tempnam = require('tempnam');
const fs = require('fs');
const sequelize = require('../../config/database');
const Media = require('../models/Media');
const UtilService = require('../services/util.service');

const DevicesController = () => {

  const getMediaRequest = async (req, res) => {
    try {
      const {mode, id} = req.query;
      let  {device_id} = req.query;
      device_id = (device_id) ? parseInt(device_id) : false;

      if (mode && mode == 'screenshot'){

        let event_id = (id) ? parseInt(id) : false;
        if((!(device_id) || !(event_id))){
          return res.status(500).json({ msg: 'E: Event ID or camera ID is required to get a screenshot.' });
        }
        const query = `SELECT id, filepath FROM Media WHERE device_id='${device_id}' AND filepath IS NOT NULL ORDER BY id DESC LIMIT 1`;
        let events = ((event_id)) ? await sequelize.query(query, { type: QueryTypes.SELECT }) : await Media.findOne({where: {id: event_id},});
        if(!events || events.length <= 0){
          return res.status(500).json({ msg: 'E: Requested event does not exist' });
        }

        console.log({
          events
        })

        events = events[0];
        if(!events['filepath']){
          return res.status(500).json({ msg: 'E: No media is associated with this event.' });
        }

        let path_to_image = events['filepath'].replace('mkv', 'jpg');  //str_replace('mkv', 'jpg', events['filepath']);
        path_to_image = path_to_image.replace('mp4', 'jpg') // str_replace('mp4', 'jpg', events['filepath']);
        if(!fs.existsSync(path_to_image)){
          return res.status(500).json({ msg: 'E: Screenshot for this event was not found' });
        }
        const img = fs.readFileSync(path_to_image, {encoding: 'base64'});
        res.setHeader('Content-Type','image/jpeg');
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': img.length
        });
        return res.end(img);
      }

      return res.status(500).json({ msg: 'E: Screenshot for this event was not found' });
      // const users = await sequelize.query("SELECT dvs.* FROM Devices as dvs INNER JOIN EventsCam as m ON dvs.id=m.device_id WHERE m.type_id='motion' OR m.type_id='continuous' GROUP BY dvs.id", { type: QueryTypes.SELECT });
      // const users = await Devices.findAll();

      // console.log({
      //   users,
      // });
      // return res.status(200).json({ users });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const strcasecmp = (fString1, fString2) => {
    //  discuss at: https://locutus.io/php/strcasecmp/
    // original by: Martijn Wieringa
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    //   example 1: strcasecmp('Hello', 'hello')
    //   returns 1: 0
    const string1 = (fString1 + '').toLowerCase()
    const string2 = (fString2 + '').toLowerCase()
    if (string1 > string2) {
      return 1
    } else if (string1 === string2) {
      return 0
    }
    return -1
  }

  const strstr = (haystack, needle, bool) => {
    //  discuss at: https://locutus.io/php/strstr/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    //   example 1: strstr('Kevin van Zonneveld', 'van')
    //   returns 1: 'van Zonneveld'
    //   example 2: strstr('Kevin van Zonneveld', 'van', true)
    //   returns 2: 'Kevin '
    //   example 3: strstr('name@example.com', '@')
    //   returns 3: '@example.com'
    //   example 4: strstr('name@example.com', '@', true)
    //   returns 4: 'name'
    let pos = 0
    haystack += ''
    pos = haystack.indexOf(needle)
    if (pos === -1) {
      return false
    } else {
      if (bool) {
        return haystack.substr(0, pos)
      } else {
        return haystack.slice(pos)
      }
    }
  }

  const nl2br = (str, replaceMode, isXhtml) => {

    var breakTag = (isXhtml) ? '<br />' : '<br>';
    var replaceStr = (replaceMode) ? '$1'+ breakTag : '$1'+ breakTag +'$2';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
  }

  const getMp4MediaSteamUrl = async (req, res) => {

    try {
      const {mode, id, fps, download} = req.query;

      if (!id || isNaN(id)) {
        return res.status(500).json({ msg: 'HTTP/1.0 400 Bad request - set id arg'});
      }

      // resolve local mediafile name and path from id parameter, using Media table;
      const query = `SELECT filepath FROM Media WHERE id=${id} LIMIT 1`;
      const query_res = await sequelize.query(query, { type: QueryTypes.SELECT }) //  data::query("SELECT filepath FROM Media WHERE id=${media_id} LIMIT 1");
      
      if (!query_res || query_res.length <= 0) {
        return res.status(500).json({ msg: 'HTTP/1.0 404 Not Found - failed to locate the file'});
      }
      let filename = query_res[0]['filepath'];

      // check video codec, using ffprobe and its parsable output (see -show-format -show-streams);
      let ffprobe_output = shell_exec(`LD_LIBRARY_PATH=/usr/lib/bluecherry/ /usr/lib/bluecherry/ffprobe -show_format -show_streams -print_format flat ${filename}`);
      if (strstr(ffprobe_output, 'streams.stream.0.codec_type="video"') === false) {
        return res.status(500).json({ msg: 'HTTP/1.0 500 Internal Server Error - file\'s first stream is not a video, FIXME to support more cases'})
      }

      let $outfile = tempnam.tempnamSync('/tmp', 'bluecherry_streaming__');
      if ($outfile === false) {
        return res.status(500).json({ msg: 'HTTP/1.0 500 Internal Server Error - failed to create temporary file'});
      }

      let $audio_options = '';
      if (strstr(ffprobe_output, 'codec_type="audio"') === false) {
        // If no audio streams detected
        $audio_options = ' -an ';
      } else if (strstr(ffprobe_output, 'codec_name="aac"') !== false) {
        // If AAC audio stream detected
        $audio_options = ' -acodec copy ';
      }else {
        // If audio stream in codec other than AAC detected
        $audio_options = ' -acodec aac -strict -2 ';
      }

      let $vcodec = "libx264";
      let $hwaccel = "";
      let $hwfilter = "";

      // $vaapi_device = $this->varpub->global_settings->data['G_VAAPI_DEVICE'];
      $vaapi_device =  await UtilService.getGlobalSetting('G_VAAPI_DEVICE')

      if (strcasecmp($vaapi_device, "none") != 0)
      {
        $vcodec = "h264_vaapi";
        $hwaccel = "-init_hw_device vaapi=hwva:$vaapi_device -hwaccel vaapi -hwaccel_output_format vaapi -hwaccel_device hwva";
        $hwfilter = "-filter_hw_device hwva -vf 'format=nv12|vaapi,hwupload'";
      }

      let ffmpeg_cmd = '';
      if (strstr(ffprobe_output, 'streams.stream.0.codec_name="h264"') !== false
          || strstr(ffprobe_output, 'streams.stream.0.codec_name="mpeg4"') !== false) {
        // -- if codec is MPEG4 or H264, remux the file into MP4 container format;
        // -faststart option must be used for MP4 file to enable instant playback start.
        ffmpeg_cmd = `LD_LIBRARY_PATH=/usr/lib/bluecherry/ /usr/lib/bluecherry/ffmpeg -i filename ${$audio_options} -vcodec copy  -movflags faststart -f mp4 -y ${$outfile} 2>&1 && echo SUCCEED`;
      } else if (strstr(ffprobe_output, 'streams.stream.0.codec_name="mjpeg"') !== false) {
        // -- otherwise, if codec is MJPEG, reencode the video stream to MPEG4 or H264 codec;
        // Lower framerate on request, but forbid making it unreasonably high to avoid DoS attack
        if (fps && (!isNaN(fps)) && fps <= 30)
          ffmpeg_cmd = `LD_LIBRARY_PATH=/usr/lib/bluecherry/ /usr/lib/bluecherry/ffmpeg ${$hwaccel} -i filename ${$audio_options} ${$hwfilter} -vcodec ${$vcodec} -r ${fps} -movflags faststart -f mp4 -y ${$outfile} 2>&1 && echo SUCCEED`;
        else
          ffmpeg_cmd = `LD_LIBRARY_PATH=/usr/lib/bluecherry/ /usr/lib/bluecherry/ffmpeg ${$hwaccel} -i filename ${$audio_options} ${$hwfilter} -vcodec ${$vcodec} -movflags faststart -f mp4 -y ${$outfile} 2>&1 && echo SUCCEED`;
      } else {
        fs.unlinkSync($outfile);
        return res.status(500).json({ msg: 'HTTP/1.0 500 Internal Server Error - unsupported codec in video file'});
      }

      let $ffmpeg_output = shell_exec(ffmpeg_cmd);
      if (strstr($ffmpeg_output, 'SUCCEED') === false) {
        return res.status(500).json({ msg: 'HTTP/1.0 500 Internal Server Error - MP4 file preparation failed', error: nl2br($ffmpeg_output)});
      }

      // After saving resulting recording to temporary file (which is necessary
      // for MP4 format), output the file contents to stdout, indicating content type
      // in HTTP headers.
      if (download) {
        filename = filename.replace('.mkv', '.mp4');

        // TODO WRITE DOWNLOAD FILE CODE
        downloadFile($outfile, filename);
      } else{
        // TODO WRITE CODE TO STREAM FILE FORM PATH
        downloadFile($outfile);
      }

    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  }

  return {
    getMediaRequest,
    getMp4MediaSteamUrl
  };
};

module.exports = DevicesController;
