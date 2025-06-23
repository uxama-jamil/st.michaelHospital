import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header';
import { Alert, Col, Row, Space } from 'antd';
import { Button, Card } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import FullPageLoader from '@/components/ui/spin';
import resetPasswordService from '@/services/reset-password-api';
import { useMessage } from '@/context/message';
import { validate } from '@/utils';
import { getPasswordStrength, validatePassword } from '@/utils';
import AntInput from '@/components/ui/input';
import SuccessModal from './success-modal';
import { useAuth } from '@/context/auth-provider';

const ResetPassword = () => {
  const { setTitle, setActions } = useHeader();
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const message = useMessage();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Add this state

  const rules = {
    oldPassword: {
      required: { value: true, message: 'Old password is required.' },
      min: { value: 8, message: 'Old password must be at least 8 characters.' },
      custom: {
        isValid: (value: string) => validatePassword(value) === undefined,
        message: 'Old password must contain uppercase, lowercase, number, and special character.',
      },
    },
    newPassword: {
      required: { value: true, message: 'New password is required.' },
      min: { value: 8, message: 'New password must be at least 8 characters.' },
      custom: {
        isValid: (value: string) => validatePassword(value) === undefined,
        message: 'New password must contain uppercase, lowercase, number, and special character.',
      },
    },
    confirmPassword: {
      required: { value: true, message: 'Confirm password is required.' },
      match: { field: 'newPassword', message: 'Passwords do not match.' },
    },
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setErrorMsg(null); // Clear previous error
        await resetPasswordService.resetPassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });

        setErrorMsg(null);
        message.success(
          'Your password has been successfully updated. You can now log in with your new credentials.',
        );
        logOut();
      } catch (error: any) {
        const apiResponse = error?.response?.data;
        if (apiResponse && Number(apiResponse.statusCode) === 30) {
          setErrorMsg(apiResponse.message || 'Current Password is incorrect.');
        } else if (apiResponse && Number(apiResponse.statusCode) === 409) {
          setErrorMsg(
            apiResponse.message ||
              'You have entered the old password please try with another password.',
          );
        } else if (apiResponse && apiResponse.message) {
          setErrorMsg(apiResponse.message);
        } else if (error?.message) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg('Failed to reset password.');
        }
      } finally {
        setSubmitting(false);
      }
    },
    validate: (values) => {
      const errors: Record<string, string> = validate(values, rules);
      if (
        values.newPassword &&
        values.confirmPassword &&
        values.newPassword !== values.confirmPassword
      ) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (values.newPassword && getPasswordStrength(values.newPassword) === 'weak') {
        errors.newPassword =
          'Password is too weak. Use at least 8 characters, including uppercase, lowercase, number, and special character.';
      }
      return errors;
    },
  });

  useEffect(() => {
    setTitle('Reset Password');
    setActions([
      <Space size={'small'} key="actions">
        <Button
          key="cancel"
          text="Cancel"
          size="small"
          type="default"
          onClick={() => navigate(-1)}
        />
        <Button
          key="save"
          onClick={formik.handleSubmit}
          htmlType="submit"
          text="Confirm"
          size="small"
          type="primary"
          loading={formik.isSubmitting}
        />
      </Space>,
    ]);
  }, [setTitle, setActions, formik.handleSubmit, formik.isSubmitting, navigate]);

  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <>
      {showSuccessModal && <SuccessModal open={true} onClose={() => setShowSuccessModal(false)} />}
      {formik.isSubmitting && <FullPageLoader fullscreen={true} />}
      <Row>
        <Col sm={{ span: 24, offset: 0 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
          <Card title="Rest password detail">
            <Row>
              <Col
                sm={{ span: 24, offset: 0 }}
                md={{ span: 20, offset: 2 }}
                lg={{ span: 18, offset: 3 }}
                xl={{ span: 16, offset: 4 }}
              >
                {errorMsg && (
                  <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />
                )}

                <form onSubmit={formik.handleSubmit}>
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <AntInput
                        label="Old Password"
                        name="oldPassword"
                        type="password"
                        placeholder="Enter your old password"
                        eye={true}
                        required
                        error={touched.oldPassword && errors.oldPassword}
                        value={values.oldPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Col>
                    <Col span={24}>
                      <AntInput
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="Enter your new Password"
                        eye={true}
                        required
                        error={touched.newPassword && errors.newPassword}
                        value={values.newPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Col>
                    <Col span={24}>
                      <AntInput
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Enter your confirm new Password"
                        eye={true}
                        required
                        error={touched.confirmPassword && errors.confirmPassword}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ResetPassword;
