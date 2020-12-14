import React, { useEffect, useState } from 'react';
import { useParams, Dispatch, connect } from 'umi';
import { Card } from 'antd';
import { PageContainer, PageLoading } from '@ant-design/pro-layout';
import { PageState } from './model';
import { getSessionUsername } from '@/utils/utils';
import AdminXForm from '@/components/AdminXForm';
import { IAdminXForm } from '@/components/AdminXForm/data';

interface FormDetailProps {
  dispatch: Dispatch;
  formmeta: Partial<IAdminXForm>;
  detail: any;
  loading: boolean;
  saving: boolean;
}

const FormDetail: React.FC<FormDetailProps> = (props) => {
  const { model, id } = useParams<{model: string, id: string}>();
  const { dispatch, formmeta, detail, loading, saving } = props;
  const isLoading = loading || !(formmeta && Object.keys(formmeta).length && (id === '0' || (detail && Object.keys(detail).length)));
  const [sessionUsername] = useState(getSessionUsername());

  useEffect(() => {
    dispatch({
      type: 'form/getMeta',
      payload: {
        model,
      },
    });
    if (id && id !== '0') {
      dispatch({
        type: 'form/getForm',
        payload: {
          model, id
        },
      });
    };
    return () => {
      dispatch({
        type: 'form/clean',
      });
    }
  }, [model, id, dispatch]);

  return (
    <>
    {isLoading ?
      <PageLoading tip="Loading..." /> :
      <PageContainer>
        <Card>
          <AdminXForm
            formmeta={{ ...formmeta, viewMode: 'Page' }}
            formdata={detail}
            onSubmit={(values: { [key: string]: any }) => {
              if (id && id !== '0') {
                values.updatedBy = sessionUsername;
                dispatch({
                  type: 'form/updateForm',
                  payload: {
                    model, id, values
                  }
                });
              } else {
                values.createdBy = sessionUsername;
                dispatch({
                  type: 'form/createForm',
                  payload: {
                    model, values
                  }
                });
              }
            }}
            showLoading={saving}
          />
        </Card>
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
    detail: form.detail,
    loading: loading.effects['form/getMeta'] && loading.effects['form/getForm'],
    saving: loading.effects['fom/createForm'] || loading.effects['form/updateForm'],
  }),
)(FormDetail);
