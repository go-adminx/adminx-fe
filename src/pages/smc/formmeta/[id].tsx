import React, { useEffect, useState } from 'react';
import { connect, Dispatch, useParams } from 'umi';
import FormRender from 'form-render/lib/antd';
import schema from './schema.json';
import { Button, Card, Drawer, Modal } from 'antd';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import MonacoEditor from 'react-monaco-editor';
import { PageState } from './model';
import CodeEditor from '@/extensions/form-render/components/code-editor';
import { getSessionUsername } from '@/utils/utils';
import { IAdminXForm } from '@/components/AdminXForm/data';
import AdminXForm from '@/components/AdminXForm';

interface FormDetailProps {
  dispatch: Dispatch;
  detail?: Partial<IAdminXForm>;
  loading: boolean;
}

const EntityFormForm: React.FC<FormDetailProps> = (props) => {
  let { id } = useParams<{id: string}>();
  const { dispatch, detail = {}, loading } = props;
  const [values, setValues] = useState({});
  const [valid, setValid] = useState([]);
  const isLoading = loading || !(id === '0' || (detail && Object.keys(detail).length));
  const [previewDrawerVisible, handleDrawerVisible] = useState<boolean>(false);
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [editModalData, setEditModalData] = useState<string>(JSON.stringify(values, null, 4));
  const [sessionUsername] = useState(getSessionUsername());

  useEffect(() => {
    if (id != '0') {
      dispatch({
        type: 'formmeta/getForm',
        payload: {
          id,
        }
      });
    }
    return () => {
      dispatch({
        type: 'formmeta/clean',
      })
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && id != '0') {
      detail.updatedBy = sessionUsername;
    } else {
      detail.createdBy = sessionUsername;
    }
    setValues(detail);
  }, [detail]);

  const onSubmit = () => {
    // valid 是校验判断的数组，valid 长度为 0 代表校验全部通过
    if (!valid.length) {
      if (id && id != '0') {
        dispatch({
          type: 'formmeta/updateForm',
          payload: {
            id, values
          }
        });
      } else {
        dispatch({
          type: 'formmeta/createForm',
          payload: values
        });
      }
    }
  };

  return (
    <PageContainer
      title={parseInt(id) > 0 ? '编辑EntityForm': '新增EntityForm'}
    >
      <Card loading={isLoading}>
        {!isLoading && (
          <FormRender
            schema={schema}
            formData={values}
            onChange={setValues}
            onValidate={setValid}
            displayType="column"
            labelWidth={100}
            widgets={{
              codeEditor: CodeEditor
            }}
          />
        )}
      </Card>
      {!isLoading && (
        <FooterToolbar>
          <Button onClick={() => {
            if (!valid.length) {
              handleDrawerVisible(true);
            }
          }}>
            预览
          </Button>
          <Button onClick={() => {
            setEditModalData(JSON.stringify(values, null ,4));
            handleEditModalVisible(true);
          }}>
            编辑
          </Button>
          <Button type="primary" onClick={onSubmit}>
            保存
          </Button>
        </FooterToolbar>
      )}
    <Drawer
      title="预览"
      width={ window.innerWidth - 300 }
      onClose={() => {
        handleDrawerVisible(false);
      }}
      visible={previewDrawerVisible}
    >
      <AdminXForm formmeta={values} />
    </Drawer>
    <Modal
      title="编辑数据"
      centered
      visible={editModalVisible}
      onOk={() => {
        setValues(JSON.parse(editModalData));
        handleEditModalVisible(false);
      }}
      onCancel={() => handleEditModalVisible(false)}
      width={800}
    >
      <MonacoEditor
        language="json"
        theme="vs-dark"
        height="600"
        value={editModalData}
        onChange={(newVal: string) => {
          setEditModalData(newVal);
        }}
      />
    </Modal>
    </PageContainer>
  );
}

export default connect(
  ({
    formmeta,
    loading
  }: {
    formmeta: PageState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    detail: formmeta.detail,
    loading: loading.effects['formmeta/getForm'],
  }),
)(EntityFormForm);
