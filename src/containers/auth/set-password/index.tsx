import { Input, Button } from '@/components/ui';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Row, Col, message } from 'antd';
import { useFormik } from 'formik';
import { validate, validatePassword } from '@/utils';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { useMessage } from '@/context/message';

const SetPassword = () => {
  const message = useMessage();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);
  const rules = {
    password: {
      required: { value: true, message: 'Password is required.' },
      min: { value: 8, message: 'Password must be at least 8 characters.' },
      custom: {
        isValid: (value: string) => validatePassword(value) === undefined,
        message: 'Password must contain uppercase, lowercase, number, and special character.',
      },
    },
    confirmPassword: {
      required: { value: true, message: 'Please confirm your password.' },
      match: { field: 'password', message: 'Passwords do not match.' },
    },
  };
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
        .post('/auth/reset', payload)
        .then((res) => {
          if (res.status) {
            message.success('Password has been reset successfully.');
            navigate('/login');
          }
        })
        .catch((error) => {
          message.error('Failed to reset password.');
        })
        .finally(() => {
          setLoading(false);
        });
    },
    validate: (values) => validate(values, rules),
  });
  const checkTokenStatus = async () => {
    try {
      const response = await api.post('/auth/tokenstatus', { token });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      message.error(errorMessage || 'The link has been expired.');
      navigate('/login');
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
            <Link to="/login">Back To Sign In</Link>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default SetPassword;
