import { Button } from '@/components/ui';

import { Input, Row } from 'antd';
import { Col } from 'antd';
import api from '@/services/api';
import { useMessage } from '@/context/message';
import { useEffect, useState } from 'react';
import FullPageLoader from '@/components/ui/spin';
import type { OTPProps } from 'antd/es/input/OTP';
import styles from './style.module.scss';
import { useAuth } from '@/context/auth-provider';
import { COOLDOWN_TIME, OTP_LENGTH } from '@/constants/auth';
import { AUTH_API_OTP, AUTH_API_OTP_RESEND } from '@/constants/api';

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
      setCooldown(COOLDOWN_TIME);
    }
  }, [user]);

  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text);

    if (error) setError('');
  };

  const onInput: OTPProps['onInput'] = (value) => {
    const joinedValue = value.join('');
    setOtp(joinedValue); // Set value on every keypress

    if (error) setError('');
  };

  const sharedProps: OTPProps = {
    onChange,
    onInput,
  };

  const handleResend = () => {
    setLoading(true);
    api
      .post(AUTH_API_OTP_RESEND, { email: user?.email })
      .then((res) => {
        if (res.status) {
          message.success('OTP sent successfully. Please check your email.');
          setCooldown(COOLDOWN_TIME);
        }
      })
      .catch(() => {
        message.error('Invalid email.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const regex = new RegExp(`^\\d{${OTP_LENGTH}}$`);
    // Basic validation
    if (!otp) {
      setError('Please enter the verification code.');
      return;
    } else if (otp.length !== OTP_LENGTH || !regex.test(otp)) {
      setError(`OTP must be exactly ${OTP_LENGTH} digits.`);
      return;
    }

    setLoading(true);
    setError('');

    api
      .post(AUTH_API_OTP, { email: user?.email, otp })
      .then((res) => {
        if (res) {
          const token = res?.data?.data?.token?.accessToken;
          if (token) {
            message.success('Login successful.');
            twoFactorAction(token);
          }
        }
      })
      .catch(() => {
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
              length={OTP_LENGTH}
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
