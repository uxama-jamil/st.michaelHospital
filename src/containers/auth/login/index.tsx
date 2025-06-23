import { Input, Button } from '@/components/ui';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import api from '@/services/api';
import { useAuth } from '@/context/auth-provider';
import style from './style.module.scss';
import { Row, Col } from 'antd';
import { validate, validatePassword } from '@/utils';
import { useMessage } from '@/context/message';
import { useState } from 'react';
import AntInput from '@/components/ui/input';

const Login = () => {
  const { loginAction } = useAuth();
  const message = useMessage();
  const [loading, setLoading] = useState(false);
  const rules = {
    email: {
      required: { value: true, message: "Email is required." },
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: { value: true, message: "Password is required." },
      min: { value: 8, message: "Password must be at least 8 characters." },
      custom: {
        isValid: (value: string) => validatePassword(value) === undefined,
        message: "Password must contain uppercase, lowercase, number, and special character.",
      },
    },
  };
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = useFormik({
    // enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      api
        .post('/auth/login', values)
        .then((res) => {
          if (res.status) {
            message.success('Login successful.');
            console.log('res', res);
            const { data } = res;
            const token = data.data.token.accessToken ? data.data.token.accessToken : '';
            const userDetails = data.data.user;
            if (token) {
              loginAction(token, userDetails);
            }
          }
        })
        .catch((error) => {
          const apiMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Login failed. Please try again.';
          message.showError(apiMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    validate: (values) => validate(values, rules),
  });
  return (
    <>
      <h1>Sign In</h1>
      <h2>Enter your credentials to sign in to your account</h2>
      <form onSubmit={handleSubmit}>
        <Row gutter={[18, 18]}>
          <Col span="24">
            <Input
              name="email"
              placeholder="Email"
              value={values.email}
              required
              error={touched.email && errors.email}
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
            />
          </Col>
          <Col span="24">
            <AntInput
              name="password"
              type="password"
              placeholder="Password"
              required
              eye={true}
              error={touched.password && errors.password}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Col>
          <Col span="24" className="text-right">
            <Link to="/forgot-password" className={style.forgotLink}>
              Forgot password?
            </Link>
          </Col>
          <Col span="24">
            <Button
              type="primary"
              htmlType="submit"
              text="Sign In"
              size="large"
              block={true}
              loading={loading}
            />
          </Col>
        </Row>
      </form>
    </>
  );
};

export default Login;
