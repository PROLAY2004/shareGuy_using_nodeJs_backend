import QRCode from 'qrcode';
import tgObj from './tgObject.js';
import getUrl from './getFilePath.js';

export default async function genQR(text, unicode) {
  try {
    const qrBuffer = await QRCode.toBuffer(text, { width: 400 });

    const tgForm = tgObj(qrBuffer, {
      filename: unicode + '.png',
      contentType: 'image/png',
    });

    const fileUrl = await getUrl(tgForm);

    return fileUrl;
  } catch (err) {
    return err;
  }
}
