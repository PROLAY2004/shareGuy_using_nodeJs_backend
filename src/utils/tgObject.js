import FormData from 'form-data';
import configuration from '../config/config.js';

export default function tgObj(buffer, fileObj) {
  const tgForm = new FormData();

  tgForm.append('chat_id', configuration.CHAT_ID);
  tgForm.append('document', buffer, fileObj);

  return tgForm;
}
