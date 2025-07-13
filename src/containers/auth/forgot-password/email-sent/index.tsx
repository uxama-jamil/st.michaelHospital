import { Button } from '@/components/ui';

import { useLocation, useNavigate } from 'react-router-dom';
import emailIcon from '@assets/svg/email-sent.svg';

import { Row } from 'antd';
import { Col } from 'antd';
import api from '@/services/api';
import { useMessage } from '@/context/message';
import { useState } from 'react';
import FullPageLoader from '@/components/ui/spin';
import { AUTH_API_FORGOT } from '@/constants/api';
import { ROUTE_PATHS } from '@/constants/route';
const EmailSent = () => {
  const navigate = useNavigate();
  const message = useMessage();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email;

  const handleResend = () => {
    setLoading(true);
    api
      .post(AUTH_API_FORGOT, { email })
      .then((res) => {
        if (res.status) {
          message.success('Email sent successfully.');
        }
      })
      .catch(() => {
        message.error('Invalid email.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <FullPageLoader text="Sending email..." fullscreen={true} />}
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <img src={emailIcon} alt="email sent" />
        </Col>

        <Col span={24}>
          <h1>Email Has Been Sent!</h1>
          <h2>Please check your inbox and click on the received link to reset your password</h2>
        </Col>

        <Col span={24}>
          <Button
            type="primary"
            block={true}
            text="Go to Sign In"
            onClick={() => navigate(ROUTE_PATHS.LOGIN)}
          />
        </Col>
        <Col span={24} className="text-center">
          <p>
            Didn’t receive link?{' '}
            <span onClick={handleResend} className="resend-link">
              Resend
            </span>
          </p>
        </Col>
      </Row>
    </>
  );
};

export default EmailSent;
