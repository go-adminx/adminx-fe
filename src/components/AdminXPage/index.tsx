import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, Dispatch, connect } from 'umi';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Dropdown, Menu, message, Modal } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer, FooterToolbar, PageLoading } from '@ant-design/pro-layout';
import { deleteForm, queryForm } from './service';
import { PageState } from './model';
import { transProTableReqArgs, canDo, getSessionUsername } from '@/utils/utils';
import { IAdminXForm } from '@/components/AdminXForm/data';
import AdminXForm from '@/components/AdminXForm';
import renderAdminXFormItem from '@/extensions/protable/form-item';
import { NumberFormItem } from '@/extensions/protable/form-item/number';
import { DateFormItem } from '@/extensions/protable/form-item/date';
import trimEnd from 'lodash/string';

const FormCompWithProTablValueType = {
  "Input": "text",
  "TextArea": "textarea",
  "CodeEditor": "code",
  "TextEditor": "text",
  "Password": "text",
  "UintPicker": "digit",
  "IntPicker": "digit",
  "FloatPicker": "digit",
  "Switch": "boolean",
  "Checkbox": "boolean",
  "VSelect": "select",
  "HSelect": "select",
  "DateTimePicker": "dateTime",
  "DatePicker": "date",
  "TimePicker": "time",
  "WeekPicker": "text",
  "MonthPicker": "text",
  "YearPicker": "text",
  "Slider": "percent",
  "Upload": "text",
  "Rating": "digit",
  "ArrayTable": "text",
  "ArrayCards": "text",
  "Section": "text",
}

const DisableShowInListFC = [
  "ArrayTable", "ArrayCards", "Section"
];

interface FormListProps {
  dispatch: Dispatch;
  formmeta: Partial<IAdminXForm>;
  loading: boolean;
}

/**
 * 删除
 * @param selectedRows
 */
const handleDelete = async (modelname: string, selectedRows: any[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteForm(modelname, {
      ids: selectedRows.map((row: any) => row.id)
    });
    hide();
    // message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const FormList: React.FC<FormListProps> = (props) => {
  const { modelname } = trimEnd(location.pathname, '/').split('/').reverse()[0];
  const { dispatch, formmeta, loading } = props;
  const { fields = [], menuLabel } = formmeta;
  const isLoading = loading || !(fields.length);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<any[]>([]);
  const [curPageFormVisible, handleCurPageFormVisible] = useState<boolean>(false);
  const [sessionUsername] = useState(getSessionUsername());

  // const canUpdate: boolean = canDo(module, app, 'update');
  const canCreate: boolean = canDo(modelname, 'create');
  const canDelete: boolean = canDo(modelname, 'delete');

  useEffect(() => {
    dispatch({
      type: 'form/getMeta',
      payload: {
        modelname
      }
    })
  }, [modelname, dispatch]);

  const deleteConfirm = (rows: any[]) => {
    Modal.confirm({
      title: '确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await handleDelete(modelname, rows);
        setSelectedRows([]);
        actionRef.current?.reloadAndRest?.();
      }
    });
  };

  const dropDownMenuAction = (key: React.ReactText, row: any) => {
    if (key === "delete") {
      deleteConfirm([row]);
    }
  };

  const columns: ProColumns<IAdminXForm>[] = [];
  columns.push({
    title: 'ID',
    dataIndex: 'id',
    sorter: true,
    renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
      if (type === 'form') {
        return null;
      }
      return <NumberFormItem {...rest} defaultOperator={'[eq]'} fieldProps={{ placeholder: '请输入', min: 1, }} />
    },
  });
  fields.forEach(field => {
    columns.push({
      title: field.label,
      dataIndex: field.key,
      search: field.inQuery ? undefined : false,
      hideInTable: !field.inList || DisableShowInListFC.includes(field.component),
      ellipsis: field.ellipsis,
      copyable: field.copyable,
      order: field.queryIdx,
      valueType: FormCompWithProTablValueType[field.component],
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return renderAdminXFormItem({field, ...rest});
      },
    });
  });
  columns.push({
    title: '更新于',
    dataIndex: 'updatedAt',
    sorter: true,
    renderText: (val: number) => new Date(val*1000).toLocaleString(),
    renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
      if (type === 'form') {
        return null;
      }
      return <DateFormItem {...rest} defaultOperator={'[btwn]'} fieldProps={{ placeholder: '请输入', showTime: true }} />
    },
  });
  columns.push({
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, row) => (
      <>
        <Link to={`${location.pathname}/${row.id}`}>编辑</Link>
        <Divider type="vertical" />
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => dropDownMenuAction(key, row)}>
              {canDelete ? <Menu.Item key="delete">删除</Menu.Item> : ''}
            </Menu>
          }
        >
          <a>更多 <DownOutlined /></a>
        </Dropdown>
      </>
    ),
  });

  const CurAdminXForm = () => {
    // 表单在modal和drawer形态下强制使用2列或1列的布局
    formmeta.viewColumns = (formmeta.viewColumns || 0) > 1 ? 2 : 1;
    return (
      <AdminXForm
        formmeta={formmeta}
        onSubmit={(values: { [key: string]: any }) => {
          values.createdBy = sessionUsername;
          dispatch({
            type: 'form/createForm',
            payload: {
              modelname, values
            },
            callback: () => {
              handleCurPageFormVisible(false);
            }
          });
        }}
        onCancel={() => {
          handleCurPageFormVisible(false);
        }}
      />
    );
  };

  return (
    <>
    {isLoading ?
      <PageLoading tip="Loading Meta..." /> :
      <PageContainer>
        <ProTable<any>
          headerTitle={`${menuLabel} 列表`}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => canCreate ? [
            formmeta.viewMode === "Page" ? (
              <Link to={`/${location.pathname}/0`} key="create">
                <Button type="primary">
                  <PlusOutlined /> 新增
                </Button>
              </Link>
            ) : (
              <Button type="primary" key="create" onClick={() => {
                handleCurPageFormVisible(true);
              }}>
                <PlusOutlined /> 新增
              </Button>
            )
            ,
          ] : []}
          request={(params, sorter, filter) => queryForm(
            modelname, transProTableReqArgs(params, sorter, filter)
          ).then((response) => {
            return {
              data: response.data.list,
              total: response.data.total,
            };
          })}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
              </div>
            }
          >
            <Button
              onClick={() => {
                deleteConfirm(selectedRowsState);
              }}
            >
              批量删除
            </Button>
          </FooterToolbar>
        )}
      {formmeta.viewMode === "Modal" && (
        <Modal
          width={800}
          title={`新增${formmeta.title || formmeta.modelName}`}
          footer={null}
          visible={curPageFormVisible}
          onCancel={() => {
            handleCurPageFormVisible(false);
          }}
        >
          <CurAdminXForm />
        </Modal>
      )}
      {formmeta.viewMode === "Drawer" && (
        <Drawer
          width={800}
          title={`新增${formmeta.title || formmeta.modelName}`}
          visible={curPageFormVisible}
          onClose={() => {
            handleCurPageFormVisible(false);
          }}
        >
          <CurAdminXForm />
        </Drawer>
      )}
      </PageContainer>
    }
    </>
  )
}

export default connect(
  ({
    form,
    loading
  }: {
    form: PageState;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    formmeta: form.formmeta,
    loading: loading.effects['form/getMeta'],
  }),
)(FormList);
