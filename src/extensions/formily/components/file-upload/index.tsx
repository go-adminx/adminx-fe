import React, { useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';
import { Button, Upload } from 'antd';
import { InboxOutlined, LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadProps } from 'antd/lib/upload';
const { Dragger: UploadDragger } = Upload;

const exts = [
  {
    ext: /\.docx?$/i,
    icon: '//img.alicdn.com/tfs/TB1n8jfr1uSBuNjy1XcXXcYjFXa-200-200.png'
  },
  {
    ext: /\.pptx?$/i,
    icon: '//img.alicdn.com/tfs/TB1ItgWr_tYBeNjy1XdXXXXyVXa-200-200.png'
  },
  {
    ext: /\.jpe?g$/i,
    icon: '//img.alicdn.com/tfs/TB1wrT5r9BYBeNjy0FeXXbnmFXa-200-200.png'
  },
  {
    ext: /\.pdf$/i,
    icon: '//img.alicdn.com/tfs/TB1GwD8r9BYBeNjy0FeXXbnmFXa-200-200.png'
  },
  {
    ext: /\.png$/i,
    icon: '//img.alicdn.com/tfs/TB1BHT5r9BYBeNjy0FeXXbnmFXa-200-200.png'
  },
  {
    ext: /\.eps$/i,
    icon: '//img.alicdn.com/tfs/TB1G_iGrVOWBuNjy0FiXXXFxVXa-200-200.png'
  },
  {
    ext: /\.ai$/i,
    icon: '//img.alicdn.com/tfs/TB1B2cVr_tYBeNjy1XdXXXXyVXa-200-200.png'
  },
  {
    ext: /\.gif$/i,
    icon: '//img.alicdn.com/tfs/TB1DTiGrVOWBuNjy0FiXXXFxVXa-200-200.png'
  },
  {
    ext: /\.svg$/i,
    icon: '//img.alicdn.com/tfs/TB1uUm9rY9YBuNjy0FgXXcxcXXa-200-200.png'
  },
  {
    ext: /\.xlsx?$/i,
    icon: '//img.alicdn.com/tfs/TB1any1r1OSBuNjy0FdXXbDnVXa-200-200.png'
  },
  {
    ext: /\.psd?$/i,
    icon: '//img.alicdn.com/tfs/TB1_nu1r1OSBuNjy0FdXXbDnVXa-200-200.png'
  },
  {
    ext: /\.(wav|aif|aiff|au|mp1|mp2|mp3|ra|rm|ram|mid|rmi)$/i,
    icon: '//img.alicdn.com/tfs/TB1jPvwr49YBuNjy0FfXXXIsVXa-200-200.png'
  },
  {
    ext: /\.(avi|wmv|mpg|mpeg|vob|dat|3gp|mp4|mkv|rm|rmvb|mov|flv)$/i,
    icon: '//img.alicdn.com/tfs/TB1FrT5r9BYBeNjy0FeXXbnmFXa-200-200.png'
  },
  {
    ext: /\.(zip|rar|arj|z|gz|iso|jar|ace|tar|uue|dmg|pkg|lzh|cab)$/i,
    icon: '//img.alicdn.com/tfs/TB10jmfr29TBuNjy0FcXXbeiFXa-200-200.png'
  },
  {
    ext: /\.[^.]+$/i,
    icon: '//img.alicdn.com/tfs/TB10.R4r3mTBuNjy1XbXXaMrVXa-200-200.png'
  }
];

const testOpts = (ext: RegExp, options: {[key: string]: any}) => {
  if (options && Array.isArray(options.include)) {
    return options.include.some(url => ext.test(url));
  }

  if (options && Array.isArray(options.exclude)) {
    return !options.exclude.some(url => ext.test(url));
  }

  return true;
};

const getThumbByUrl = (url: string, options: {[key: string]: any}) => {
  for (let i = 0; i < exts.length; i++) {
    if (exts[i].ext.test(url) && testOpts(exts[i].ext, options)) {
      return exts[i].icon || url
    }
  }
  return url;
};

const normalizeFileList = (fileList: {[key: string]: any}[]) => {
  if (typeof fileList === 'string') {
    try {
      fileList = JSON.parse(fileList);
    } catch {
      return [];
    }
  }
  if (fileList && fileList.length) {
    return fileList.map(file => {
      const resFile = file?.response?.data || {};
      return {
        uid: resFile.uid || file.uid,
        name: resFile.uid || file.name,
        url: resFile.url || file.url,
        ...resFile,
        thumbUrl: file.thumbUrl || getThumbByUrl(resFile.thumbUrl, {
          exclude: ['.png', '.jpg', '.jpeg', '.gif']
        })
      }
    })
  }
  return [];
};

export const FileUpload: React.FC<ISchemaFieldComponentProps> = props => {
  const { value, mutators, schema } = props;
  const { listType = 'text', locale, module, app, limit, isPrivate, ...others } = schema['x-component-props'] || {};
  const [curFileList, setFileList] = useState(normalizeFileList(value));
  const [loading, setLoaing] = useState<boolean>(false);

  const uploadProps: UploadProps = {
    ...others,
    name: 'file',
    action: `/api/common/fileupload?module=${module || ''}&app=${app || ''}`,
    headers: {
      'Authorization': localStorage.getItem('X-AdminX-Token') || '',
    },
    listType: listType,
    defaultFileList: normalizeFileList(value),
    onChange(info) {
      if (info.file.status === 'uploading') {
        setLoaing(true);
        return;
      }
      if (info.file.status == 'done') {
        setLoaing(false);
      }
      let fileList = info.fileList ? [...info.fileList] : [];
      if (
        fileList.every(file => {
          if (file.url) return true
          if (file.response && file.response.data && file.response.data.url) return true
          return false
        }) && fileList.length
      ) {
        fileList = normalizeFileList(fileList);
      }
      if (limit) {
        fileList = fileList.slice(-limit);
      }
      setFileList(fileList);
      mutators.change(fileList.length > 0 ? fileList : undefined);
    },
    onRemove(file) {
      const fileList: {[key: string]: any}[] = [];
      curFileList.forEach((item: {[key: string]: any}) => {
        if (item.uid !== file.uid) {
          fileList.push(item);
        }
      });
      setFileList(fileList);
      mutators.change(fileList);
    },
  };

  if (listType.indexOf('card') > -1) {
    return (
      <Upload {...uploadProps}>
        <div>
          {loading ? <LoadingOutlined /> : uploadProps.defaultFileList && uploadProps.defaultFileList[0].url ? <img src={uploadProps.defaultFileList[0].url} alt="avatar" style={{ width: '100%' }} /> : <><PlusOutlined /><div className={'ant-upload-text'}>上传</div></>}
        </div>
      </Upload>
    )
  }
  if (listType.indexOf('dragger') > -1) {
    return (
      <UploadDragger {...uploadProps}>
        <p className={'ant-upload-drag-icon'}>
          <InboxOutlined />
        </p>
        <p className={'ant-upload-text'}>拖拽上传</p>
      </UploadDragger>
    )
  }
  return (
    <Upload {...uploadProps}>
      <Button style={{ margin: '0 0 10px' }}>
        <UploadOutlined />
        {(locale && locale.uploadText) || '上传文件'}
      </Button>
    </Upload>
  )
};

export default FileUpload;
