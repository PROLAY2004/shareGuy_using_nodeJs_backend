import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    uniqueCode: {
      type: String,
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

const fileUpload = mongoose.model('fileStructure', fileSchema);
export default fileUpload;
