import {Server} from '../server';

export function CreateCameraXML(obj: any) {
  Server.Logs.trace(obj);

  var xml = '<?xml version="1.0" encoding="UTF-8" \x3f><devices>';
  obj.forEach((device: any) => {
    xml += '  <device';
    if (!device.id) xml += ' id="' + device.info['id'] + '"';
    xml += '>';

    for (var prop in device)
      xml += `    <${prop}>` + device[prop] + `</${prop}>`;
    xml += '  </device>';
  });
  xml += '</devices>';
  return xml;
}

function escapeHtml(text: any) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
