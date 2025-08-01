import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userManagementServices from '@/services/user-management-api';
import { Spin, Alert, Row, Col, Space } from 'antd';
import { Button, Card } from '@/components/ui';
import { useFormik } from 'formik';
import { validate } from '@/utils';
import { useMessage } from '@/context/message';
import AntInput from '@/components/ui/input';
import AntDropdown from '@/components/ui/dropdown';
import { USER_ROUTES } from '@/constants/route';
import { useHeader } from '@/context/header';
import { useLocation } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { userRules } from '@/utils/rules';

const EditViewUser = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isViewOnly = location.state?.isViewOnly === true;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designation, setDesignation] = useState<string[]>([]);
  const message = useMessage();
  const { setTitle, setActions, setBreadcrumbs, setSubtitle } = useHeader();
  const fetched = useRef({
    user: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      getDesignation();
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  // Fetch and normalize user
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const response = await userManagementServices.getUserById(id);
          const data = response?.data;

          if (data) {
            // Normalize data for form fields
            const normalized = {
              name: data.name || '',
              email: data.email || '',
              phoneNumber: data.phone || '',
              designation: data.designation || '',
            };
            setUser(normalized);
          } else {
            setError('User data not found.');
          }
        } else {
          setError('No user ID provided.');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    if (!fetched.current.user) {
      fetchUser();
      fetched.current.user = true;
    }
  }, [id]);

  const getDesignation = async () => {
    const designation = await userManagementServices.getUserDesignation();
    const designationData = designation?.data;
    setDesignation(designationData);
  };

  // Setup formik
  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      designation: user?.designation || '',
    },
    enableReinitialize: true,
    validate: (values) => validate(values, userRules),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!id) throw new Error('No user ID provided.');
        const payload: any = {
          id,
          username: values.name,
          picture: '',
          phone: values.phoneNumber.replace(/\D/g, ''),
        };
        if (values.designation) {
          payload.designation = values.designation;
        }
        await userManagementServices.updateUser(id, payload);
        message.success('User updated successfully.');
        setUser(values);
        navigate(USER_ROUTES.BASE);
      } catch (error) {
        message.showError(error, 'Failed to update user.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Set page UI
  useEffect(() => {
    setTitle(isViewOnly ? 'View User' : 'Edit User');
    setSubtitle('');

    setActions([
      <Space size="small">
        <Button
          key="cancel"
          text={!isViewOnly ? 'Cancel' : 'Back to Users'}
          size="small"
          type="default"
          onClick={() => navigate(USER_ROUTES.BASE)}
        />
        {!isViewOnly && (
          <Button
            key="save"
            onClick={formik.handleSubmit}
            htmlType="submit"
            text="Save"
            size="small"
            type="primary"
            loading={formik.isSubmitting}
            style={{ width: '100%' }}
          />
        )}
      </Space>,
    ]);
    setBreadcrumbs([
      { label: 'User Management', onClick: () => navigate(USER_ROUTES.BASE) },
      { label: isViewOnly ? 'View User' : 'Edit User', active: true },
    ]);
  }, [formik.handleSubmit, formik.isSubmitting]);

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Row>
      <Col sm={{ span: 24 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
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
                      error={formik.touched.name && formik.errors.name?.toString()}
                      disabled={isViewOnly}
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
                      error={formik.touched.email && formik.errors.email?.toString()}
                      disabled
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
                      disabled={isViewOnly}
                      placeholder="Enter phone number"
                      className={`input-phone ant-input${formik.touched.phoneNumber && formik.errors.phoneNumber ? ' error' : ''}`}
                    />
                    {formik.touched.phoneNumber &&
                      typeof formik.errors.phoneNumber === 'string' && (
                        <p className={'error'}>{formik.errors.phoneNumber}</p>
                      )}
                  </Col>
                  <Col span={24}>
                    <AntDropdown
                      label="Designation"
                      options={designation.map((designation) => ({
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
                      error={formik.touched.designation && formik.errors.designation?.toString()}
                      disabled={isViewOnly}
                    />
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default EditViewUser;
