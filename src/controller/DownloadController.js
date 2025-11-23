export default class DownloadController {
  fileExport = async (req, res, next) => {
    console.log('Downloading from code : ' + req.params.code);

    res.status(200).json({
      success: true,
      message: 'Downloading from code : ' + req.params.code,
    });
  };
}
