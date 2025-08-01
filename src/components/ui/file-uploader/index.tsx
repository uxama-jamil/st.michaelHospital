import { Upload, Spin } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import { useMessage } from '@/context/message';
import { useState, useEffect } from 'react';
import { ModuleContentType } from '@/constants/module';
import type { GenericUploadProps } from '@/types/modules';
import contentService from '@/services/content-api';
import { Button } from '@/components/ui';
import type { FileInfo, FileUploadResponse } from '@/types/content';
import { extractOriginalFilename, getFileInfo } from '@/utils';

const getAcceptType = (type: ModuleContentType): string => {
  switch (type) {
    case ModuleContentType.Image:
      return 'image/*';
    case ModuleContentType.Video:
      return 'video/*';
    case ModuleContentType.Audio:
      return 'audio/*';
    case ModuleContentType.Document:
      return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
    default:
      return '*';
  }
};

const isValidType = (file: RcFile, type: ModuleContentType): boolean => {
  if (type === ModuleContentType.Image) return file.type.startsWith('image/');
  if (type === ModuleContentType.Video) return file.type.startsWith('video/');
  if (type === ModuleContentType.Audio) return file.type.startsWith('audio/');
  if (type === ModuleContentType.Document) {
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const allowedExt = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
    return allowedExt.includes(ext);
  }
  return false;
};

const validateImageDimensions = (
  file: RcFile,
  maxWidth: number,
  maxHeight: number,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      URL.revokeObjectURL(img.src);
      if (width <= maxWidth && height <= maxHeight) resolve(true);
      else reject(new Error(`Image must be max ${maxWidth}x${maxHeight}px.`));
    };
    img.onerror = () => reject(new Error('Invalid image.'));
  });
};

const FileUpload = ({
  label = 'Upload File',
  type,
  required,
  onChange,
  maxSizeMB,
  isEditMode = false,
  maxWidth,
  maxHeight,
  accessUrl,
  mediaLength,
  fileDetails,
  value,
  error,
  ...props
}: GenericUploadProps & { required?: boolean; mediaLength?: (length: number) => void }) => {
  const message = useMessage();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (value) {
      setFileList([
        {
          uid: '1',
          name: (isEditMode ? extractOriginalFilename(value) : value) || 'Uploaded-File',
          url: accessUrl ? accessUrl : '',
          status: 'done',
        },
      ]);
    }
  }, [value]);

  const uploadProps: UploadProps = {
    accept: getAcceptType(type),
    fileList,
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: true,
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setFileList([]);

        setLoading(true);
        const rcFile = file as RcFile;

        if (!isValidType(rcFile, type)) {
          message.showError('Please upload a valid file.', 'Invalid type');
          return onError?.(new Error('Invalid file type'));
        }

        if (maxSizeMB && rcFile.size / 1024 / 1024 > maxSizeMB) {
          message.showError(`File must be under ${maxSizeMB}MB`, 'Upload error');
          return onError?.(new Error('File too large'));
        }

        if (type === ModuleContentType.Image && maxWidth && maxHeight) {
          await validateImageDimensions(rcFile, maxWidth, maxHeight);
        }

        const uid = Date.now().toString();
        setFileList([
          {
            uid,
            name: rcFile.name,
            status: 'uploading',
          },
        ]);
        const fileInfo: FileInfo = {
          filename: rcFile.name,
          type: type,
          mimetype: rcFile.type,
        };
        let fileData;
        if (type !== ModuleContentType.Image) {
          fileData = await getFileInfo(rcFile);
        }
        const length = fileData?.length || 0;

        const uploadedFile: UploadFile = {
          uid,
          name: rcFile.name,
          url: accessUrl ? encodeURI(accessUrl) : '',
          status: 'done',
        };

        setFileList([uploadedFile]);
        onChange?.(uploadedFile.name);
        fileDetails?.({ file: rcFile, fileInfo: fileInfo });
        mediaLength?.(length.toFixed());
        onSuccess?.(uploadedFile);
      } catch (err: any) {
        setFileList((prev) => prev.map((f) => ({ ...f, status: 'error' })));
        message.showError(err, 'Upload failed');
        onError?.(err);
      } finally {
        setLoading(false);
      }
    },
    onRemove: () => {
      setFileList([]);
      onChange(null);
    },
  };

  const renderHintText = () => {
    if (!maxSizeMB && !(type === ModuleContentType.Image && maxWidth && maxHeight)) return null;

    if (type === ModuleContentType.Image) {
      const dim = maxWidth && maxHeight ? ` (max. ${maxWidth}x${maxHeight}px)` : '';
      const size = maxSizeMB ? `, Maximum image size to upload is ${maxSizeMB}MB` : '';
      return `PNG, JPG or GIF${dim}${size}`;
    }

    if (type === ModuleContentType.Video && maxSizeMB)
      return `MP4, WebM, etc. — Maximum file size: ${maxSizeMB}MB`;

    if (type === ModuleContentType.Audio && maxSizeMB)
      return `MP3, WAV, etc. — Maximum file size: ${maxSizeMB}MB`;

    if (type === ModuleContentType.Document && maxSizeMB)
      return `PDF, DOC, DOCX, XLS, etc. — Maximum file size: ${maxSizeMB}MB`;

    return null;
  };

  return (
    <div className={styles.uploadContainer}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={'error'}>*</span>}
        </label>
      )}

      <Spin spinning={loading}>
        <Upload.Dragger
          {...uploadProps}
          className={`uploadDragger ${error ? 'error' : ''}`}
          {...props}
        >
          <div className={styles.uploadButton}>
            <p className="ant-upload-text">Drag and drop to upload your {type.toLowerCase()}</p>
            <Button
              icon={<UploadOutlined />}
              loading={loading}
              text={` Upload ${type}`}
              type="primary"
              size="small"
            />

            {renderHintText() && <p className="ant-upload-hint">{renderHintText()}</p>}
          </div>
        </Upload.Dragger>
      </Spin>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default FileUpload;
