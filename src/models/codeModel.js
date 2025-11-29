import mongoose from 'mongoose';
import { string } from 'yup';

const codeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    fileIds: {
      type: [String],
      required: true,
    },
    qrPath: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const uniqueCode = mongoose.model('uniCode', codeSchema);
export default uniqueCode;
