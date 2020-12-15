import React, { useState, useRef } from 'react';
import { Link } from 'umi';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, message, Menu } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { queryFormMeta, deleteFormMeta } from './service';
import { transProTableReqArgs } from '@/utils/utils';
import { FormMeta } from '@/interface';

/**
 * 删除
 * @param selectedRows
 */
const handleRemove = async (selectedRows: FormMeta[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteFormMeta({
      ids: selectedRows.map((row) => row.id)
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const FormMetaList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<FormMeta[]>([]);
  const columns: ProColumns<FormMeta>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: 'Model',
      dataIndex: 'modelName',
    },
    {
      title: '表单状态',
      dataIndex: 'status'
    },
    {
      title: '表单视图',
      dataIndex: 'viewMode',
    },
    {
      title: '视图列数',
      dataIndex: 'viewColumns',
    },
    {
      title: '更新于',
      dataIndex: 'updatedAt',
      sorter: true,
      renderText: (val: number) => new Date(val*1000).toLocaleString(),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, row) => (
        <>
          <Link to={`/smc/formmeta/${row.id}`}>编辑</Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>同步</Menu.Item>
                <Menu.Item>预览</Menu.Item>
              </Menu>
            }
          >
            <a>更多 <DownOutlined /></a>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<FormMeta>
        headerTitle="FormMeta List"
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Link to="/smc/formmeta/0" key="create">
            <Button type="primary">
              <PlusOutlined /> 新增
            </Button>
          </Link>,
        ]}
        request={(params, sorter, filter) => queryFormMeta(
          transProTableReqArgs(params, sorter, filter)
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
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  )
};

export default FormMetaList;
