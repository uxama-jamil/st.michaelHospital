import { Input, Button } from '@/components/ui';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Row, Col } from 'antd';
import { useFormik } from 'formik';
import { validate } from '@/utils';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useMessage } from '@/context/message';
import { setPasswordRules } from '@/utils/rules';
import { ROUTE_PATHS } from '@/constants/route';
import { AUTH_API_RESET, AUTH_API_TOKEN_STATUS } from '@/constants/api';

const SetPassword = () => {
  const message = useMessage();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';

  useEffect(() => {
    if (!token) {
      navigate(ROUTE_PATHS.LOGIN);
    }
  }, [token, navigate]);

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const payload = {
        token,
        password: values.password,
      };

      api
        .post(AUTH_API_RESET, payload)
        .then((res) => {
          if (res.status) {
            message.success('Password has been reset successfully.');
            navigate(ROUTE_PATHS.LOGIN);
          }
        })
        .catch(() => {
          message.error('Failed to reset password.');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    validate: (values) => validate(values, setPasswordRules),
  });
  const checkTokenStatus = async () => {
    try {
      const response = await api.post(AUTH_API_TOKEN_STATUS, { token });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      message.error(errorMessage || 'The link has been expired.');
      navigate(ROUTE_PATHS.LOGIN);
    }
  };

  useEffect(() => {
    if (token) {
      checkTokenStatus();
    }
  }, [token]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <h1>Set Your Password</h1>
          </Col>
          <Col span={24}>
            <Input
              name="password"
              type="password"
              placeholder="New Password"
              eye={true}
              required
              error={touched.password && errors.password}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Col>
          <Col span={24}>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              eye={true}
              required
              error={touched.confirmPassword && errors.confirmPassword}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              text="Set Password"
              block={true}
              loading={loading}
            />
          </Col>
          <Col span="24" className="text-center">
            <Link to={ROUTE_PATHS.LOGIN}>Back to Sign In</Link>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default SetPassword;
