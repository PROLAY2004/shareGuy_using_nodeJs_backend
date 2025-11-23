export default async function getUrl(fileId) {
  try {
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
