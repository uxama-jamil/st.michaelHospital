import { Input, Button } from '@/components/ui';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import api from '@/services/api';
import { useAuth } from '@/context/auth-provider';
import style from './style.module.scss';
import { Row, Col } from 'antd';
import { validate } from '@/utils';
import { useMessage } from '@/context/message';
import { useState } from 'react';
import AntInput from '@/components/ui/input';
import { RoleType } from '@/constants/user-management';
import { AUTH_ROUTES, ROUTE_PATHS } from '@/constants/route';
import { loginRules } from '@/utils/rules';
import { AUTH_API_LOGIN } from '@/constants/api';

const Login = () => {
  const { loginAction } = useAuth();
  const message = useMessage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      const payload = { ...values, role: RoleType.ADMIN };
      api
        .post(AUTH_API_LOGIN, payload)
        .then((res) => {
          if (res.status) {
            const { data } = res;

            const userDetails = data?.data;

            if (userDetails) {
              message.info('Please check your email for OTP.');
              loginAction(userDetails);
              navigate(AUTH_ROUTES.TWO_FACTOR_AUTH);
            }
          }
        })
        .catch((error) => {
          const apiMessage =
            error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
          message.showError(apiMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    validate: (values) => validate(values, loginRules),
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
            <Link to={ROUTE_PATHS.FORGOT_PASSWORD} className={style.forgotLink}>
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
