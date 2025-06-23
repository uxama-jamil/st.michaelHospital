import { Input, Button } from '@/components/ui';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { Col } from 'antd';
import { Row } from 'antd';
import { validate } from '@/utils';
import { useMessage } from '@/context/message';
import { useEffect, useState } from 'react';

const ForgotPassword = ({ onBackToSignIn }: { onBackToSignIn?: () => void }) => {
  const message = useMessage();
  const [loading, setLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Add cooldown state
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const rules = {
    email: {
      required: { value: true, message: 'Email is required.' },
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  };

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: (values) => {
      setLoading(true);
      api
        .post('/auth/forgot', values)
        .then((res) => {
          if (res.status) {
            message.success('Email sent successfully.');
            setIsEmailSent(true);
            navigate('/email-sent', { state: { email: values.email } });
          }
        })
        .catch((error) => {
          setIsEmailSent(false);
          const apiMessage = error?.response?.data?.message || error?.message || 'Invalid email.';
          message.showError(apiMessage);
        })
        .finally(() => {
          setLoading(false);
          setIsEmailSent(false);
          if (isEmailSent) {
            setCooldown(60); // Start cooldown after submit
          }
        });
    },
    validate: (values) => validate(values, rules),
  });

  return (
    <>
      <h1>Forgot Your Password</h1>
      <h2>
        Enter your registered email below and we will send an email with instructions to reset your
        password.
      </h2>
      <form onSubmit={handleSubmit}>
        <Row gutter={[20, 20]}>
          <Col span="24">
            <Input
              placeholder="Email"
              type="email"
              required
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
            />
          </Col>
          <Col span="24">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              text={cooldown > 0 ? `Send (${cooldown}s)` : 'Send'}
              block={true}
              loading={loading}
              disabled={loading || (cooldown > 0 && !isEmailSent)}
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

export default ForgotPassword;
