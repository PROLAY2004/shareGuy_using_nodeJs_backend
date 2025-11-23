import uniqueCode from '../models/codeModel.js';

export default async function generateCode() {
  try {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const isCode = await uniqueCode.find({ code: result });

    if (isCode.length !== 0) {
      return generateCode();
    } else {
      return result.toLocaleUpperCase();
    }
  } catch (err) {
    return err;
  }
}
