import axios from 'axios';
import configuration from '../config/config.js';

export default async function getUrl(tgForm) {
  try {
    const sendResponse = await axios.post(
      `https://api.telegram.org/bot${configuration.BOT_TOKEN}/sendDocument`,
      tgForm,
      { headers: tgForm.getHeaders() }
    );

    const fileId = sendResponse.data.result.document.file_id;

    const getFileResp = await axios.get(
      `https://api.telegram.org/bot${configuration.BOT_TOKEN}/getFile`,
      { params: { file_id: fileId } }
    );

    const filePath = getFileResp.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${configuration.BOT_TOKEN}/${filePath}`;

    return fileUrl;
  } catch (err) {
    return err;
  }
}
