import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header';
import { Button, Card } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Space } from 'antd';
import AntInput from '@/components/ui/input';
import AntDropdown from '@/components/ui/dropdown';
import { useFormik } from 'formik';
import { validate } from '@/utils';
import { USER_ROUTES } from '@/constants/route';
import userManagementServices from '@/services/user-management-api';
import { useMessage } from '@/context/message';
import { IMaskInput } from 'react-imask';
import { RoleType, UserDesignation } from '@/constants/user-management';
import FullPageLoader from '@/components/ui/spin';
import ResendModal from '../resend-modal';
import { userRules } from '@/utils/rules';

const AddUser = () => {
  const { setTitle, setActions, setBreadcrumbs, setSubtitle } = useHeader();
  const [resendModalOpen, setResendModalOpen] = useState(false);
  const [resendEmail, setResendEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const message = useMessage();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
      designation: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload: any = {
          role: RoleType.ADMIN,
          userName: values.name,
          email: values.email,
          phone: values.phoneNumber.replace(/\D/g, ''),
        };
        if (values.designation) {
          payload.designation = values.designation;
        }
        await userManagementServices.createUser(payload);
        setResendEmail(payload.email);
        setResendModalOpen(true);
      } catch (error) {
        message.showError(error, 'Failed to create user.');
      } finally {
        setSubmitting(false);
      }
    },
    validate: (values) => validate(values, userRules),
  });

  useEffect(() => {
    setTitle('New User');
    setSubtitle('');
    setActions([
      <Space size={'small'}>
        <Button
          key="cancel"
          text="Cancel"
          size="small"
          type="default"
          onClick={() => navigate(USER_ROUTES.BASE)}
        />
        <Button
          key="save"
          onClick={formik.handleSubmit}
          htmlType="submit"
          text="Save"
          size="small"
          type="primary"
          loading={formik.isSubmitting}
        />
      </Space>,
    ]);
    setBreadcrumbs([
      {
        label: 'User Management',
        onClick: () => navigate(USER_ROUTES.BASE),
      },
      {
        label: 'Add New User',
        onClick: () => {},
        active: true,
      },
    ]);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {formik.isSubmitting && <FullPageLoader fullscreen={true} />}
      <Row>
        <Col sm={{ span: 24, offset: 0 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
          <Card title="User detail">
            <Row>
              <Col
                sm={{ span: 24, offset: 0 }}
                md={{ span: 20, offset: 2 }}
                lg={{ span: 18, offset: 3 }}
                xl={{ span: 16, offset: 4 }}
              >
                <form onSubmit={formik.handleSubmit}>
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <AntInput
                        label="Full Name"
                        required
                        placeholder="Enter full name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name}
                      />
                    </Col>
                    <Col span={24}>
                      <AntInput
                        label="Email Address"
                        required
                        placeholder="Enter email address"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email}
                      />
                    </Col>
                    <Col span={24}>
                      <label>
                        Phone Number <sup>*</sup>
                      </label>
                      <IMaskInput
                        mask="(000) 000-0000"
                        value={formik.values.phoneNumber}
                        onAccept={(value: any) => formik.setFieldValue('phoneNumber', value)}
                        onBlur={formik.handleBlur}
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        className={`input-phone ant-input${formik.touched.phoneNumber && formik.errors.phoneNumber ? ' error' : ''}`}
                      />
                      {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                        <p className={'error'}>{formik.errors.phoneNumber}</p>
                      )}
                    </Col>
                    <Col span={24}>
                      <AntDropdown
                        label="Designation"
                        options={Object.values(UserDesignation).map((designation) => ({
                          label: designation,
                          value: designation,
                        }))}
                        style={{ width: '100%' }}
                        placeholder="Select Designation"
                        name="designation"
                        value={formik.values.designation ? [formik.values.designation] : []}
                        onChange={(value: string | number | (string | number)[]) =>
                          formik.setFieldValue('designation', value || '')
                        }
                        onBlur={() => formik.setFieldTouched('designation', true)}
                        error={formik.touched.designation && formik.errors.designation}
                      />
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <ResendModal
        open={resendModalOpen}
        onClose={() => setResendModalOpen(false)}
        email={resendEmail || ''}
      />
    </>
  );
};

export default AddUser;
