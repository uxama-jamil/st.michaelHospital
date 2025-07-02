import { Button } from '@/components/ui';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import emailIcon from '@assets/svg/email-sent.svg';

import { Input, Row } from 'antd';
import { Col } from 'antd';
import api from '@/services/api';
import { useMessage } from '@/context/message';
import { useEffect, useState } from 'react';
import FullPageLoader from '@/components/ui/spin';
import type { OTPProps } from 'antd/es/input/OTP';
import styles from './style.module.scss';
import { useAuth } from '@/context/auth-provider';

const TwoFactorAuth = () => {
  const message = useMessage();
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0); // Add cooldown state

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { user, twoFactorAction } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (user) {
      setCooldown(60);
    }
  }, [user]);

  const onChange: OTPProps['onChange'] = (text) => {
    console.log('onChange:', text);
    setOtp(text);
    console.log('otp in onChange', otp);
    if (error) setError('');
  };

  const onInput: OTPProps['onInput'] = (value) => {
    const joinedValue = value.join('');
    setOtp(joinedValue); // Set value on every keypress
    console.log('otp in onInput', otp);
    if (error) setError('');
  };

  const sharedProps: OTPProps = {
    onChange,
    onInput,
  };

  const handleResend = () => {
    setLoading(true);
    api
      .post('/auth/resend-otp', { email: user?.email })
      .then((res) => {
        if (res.status) {
          message.success('OTP sent successfully. Please check your email.');
          setCooldown(60);
        }
      })
      .catch((error) => {
        message.error('Invalid email.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('otp in handleSubmit', otp);
    // Basic validation
    if (!otp) {
      setError('Please enter the verification code.');
      return;
    } else if (otp.length !== 5 || !/^\d{5}$/.test(otp)) {
      setError('OTP must be exactly 5 digits.');
      return;
    }

    setLoading(true);
    setError('');

    api
      .post('/auth/otp', { email: user?.email, otp })
      .then((res) => {
        if (res) {
          const token = res?.data?.data?.token?.accessToken;
          if (token) {
            message.success('Login successful.');
            twoFactorAction(token);
          }
        }
      })
      .catch((error) => {
        message.error('Invalid or expired OTP.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <FullPageLoader text="Sending otp..." fullscreen={true} />}
      <form onSubmit={handleSubmit}>
        <Row gutter={[20, 20]} className={styles.twoFactorAuth}>
          <Col span={24}>
            <h1>Verify your email</h1>
            <h2 className={styles.description}>
              Please enter the 5-digit verification code we sent to your registered email address.
            </h2>
          </Col>
          <Col span={24}>
            <Input.OTP
              length={5}
              status={error ? 'error' : ''}
              value={otp}
              {...sharedProps}
              formatter={(value) => value.replace(/\D/g, '')}
            />
            {error && <p className={'error'}>{error}</p>}
          </Col>
          {cooldown > 0 && (
            <Col span={24} className="text-center">
              <h2 className={styles.cooldown}>
                Expires in <span className={styles.seconds}>{cooldown}</span> Seconds
              </h2>
            </Col>
          )}

          <Col span={24}>
            <Button
              type="primary"
              block={true}
              text="Submit"
              onClick={() => handleSubmit()}
              disabled={loading || otp.length !== 5}
              loading={loading}
            />
          </Col>
          <Col span={24} className="text-center">
            <p>
              Didn’t receive link?{' '}
              <span
                onClick={cooldown === 0 ? handleResend : undefined}
                className={`resend-link ${cooldown > 0 ? 'disabled' : ''}`}
              >
                Resend
              </span>
            </p>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default TwoFactorAuth;
