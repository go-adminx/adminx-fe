import { Form, Button, Input, Popover, Progress, message } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { Link, connect, history, Dispatch, SelectLang } from 'umi';
import logo from '@/assets/logo.svg';
import { StateType } from './model';
import styles from '../style.less';
import Footer from '@/components/Footer';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      强度：强
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      强度：中
    </div>
  ),
  poor: (
    <div className={styles.error}>
      强度：太短
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface SignUpProps {
  dispatch: Dispatch;
  signUp: StateType;
  submitting: boolean;
}

const SignUp: FC<SignUpProps> = ({
  submitting,
  dispatch,
  signUp,
}) => {
  const [visible, setvisible]: [boolean, any] = useState(false);
  const [popover, setpopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!signUp) {
      return;
    }
    if (signUp.code === 0) {
      message.success('注册成功！');
      location.replace('/user/signin');
    }
  }, [signUp]);
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'signUp/submit',
      payload: {
        ...values,
      },
    });
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setvisible(!!value);
      return promise.reject('请输入密码！');
    }
    // 有值的情况
    if (!visible) {
      setvisible(!!value);
    }
    setpopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>Ant Design</span>
            </Link>
          </div>
          <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
        </div>

        <div className={styles.main}>
          <h3>注册</h3>
          <Form form={form} name="UserRegister" onFinish={onFinish}>
            <FormItem
              name="nickname"
            >
              <Input size="large" placeholder="昵称" />
            </FormItem>
            <FormItem
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入邮箱地址！',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误！',
                },
              ]}
            >
              <Input size="large" placeholder="邮箱" />
            </FormItem>
            <Popover
              getPopupContainer={(node) => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }
                return node;
              }}
              content={
                visible && (
                  <div style={{ padding: '4px 0' }}>
                    {passwordStatusMap[getPasswordStatus()]}
                    {renderPasswordProgress()}
                    <div style={{ marginTop: 10 }}>
                      请至少输入 6 个字符。请不要使用容易被猜到的密码。
                    </div>
                  </div>
                )
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              <FormItem
                name="password"
                className={
                  form.getFieldValue('password') &&
                  form.getFieldValue('password').length > 0 &&
                  styles.password
                }
                rules={[
                  {
                    validator: checkPassword,
                  },
                ]}
              >
                <Input
                  size="large"
                  type="password"
                  placeholder="至少6位密码，区分大小写"
                />
              </FormItem>
            </Popover>
            <FormItem
              name="password2"
              rules={[
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: checkConfirm,
                },
              ]}
            >
              <Input
                size="large"
                type="password"
                placeholder="确认密码"
              />
            </FormItem>
            <FormItem>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                注册
              </Button>
              <Link className={styles.login} to="/user/login">
                使用已有账户登录
              </Link>
            </FormItem>
          </Form>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default connect(
  ({
    signUp,
    loading,
  }: {
    signUp: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    signUp,
    submitting: loading.effects['signUp/submit'],
  }),
)(SignUp);