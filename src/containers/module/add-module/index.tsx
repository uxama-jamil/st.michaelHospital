import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header';
import { Button, Card } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Space } from 'antd';
import AntInput from '@/components/ui/input';
import AntTextArea from '@/components/ui/text-area';
import AntDropdown from '@/components/ui/dropdown';
import FileUpload from '@/components/ui/file-uploader';
import { useFormik } from 'formik';
import { validate } from '@/utils';
import { MODULES_ROUTES } from '@/constants/route';
import type { ModuleForm } from '@/types/modules';
import { useMessage } from '@/context/message';
import api from '@/services/modules-management';
import keyword from '@/services/api';
import { KEYWORDS_API } from '@/constants/api';
import FullPageLoader from '@/components/ui/spin';
import { mockImages } from '@/constants/image-links';
import { ButtonType } from '@/constants/button';

const AddModule = () => {
  const message = useMessage();
  const { id } = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [initialValues, setInitialValues] = useState<ModuleForm>({
    title: '',
    keywordIds: [],
    description: '',
    thumbnail: mockImages[Math.floor(Math.random() * mockImages.length)],
  });
  const { setTitle, setActions, setBreadcrumbs } = useHeader();
  const rules = {
    title: {
      required: { value: true, message: 'Module name is required.' },
      min: { value: 3, message: 'Module name must be between 3 and 50 characters.' },
      max: { value: 50, message: 'Module name must be between 3 and 50 characters.' },
    },
    keywordIds: {
      required: false,
    },
    description: {
      required: { value: true, message: 'Description is required.' },
      min: { value: 3, message: 'Description must be at least 3 characters.' },
      max: { value: 500, message: 'Description must not exceed 500 characters.' },
    },
    thumbnail: {
      required: false,
    },
  };

  // Fetch module data
  useEffect(() => {
    getKeywords();
    const fetchModule = async () => {
      try {
        setIsLoading(true);
        const response = await api.getModule(id);
        const data = response?.data;
        if (data) {
          // Normalize data for form fields
          const normalized = {
            title: data.title || '',
            keywordIds: data.keywords.map((keyword: any) => keyword.id) || [],
            description: data.description || '',
            thumbnail: data.thumbnail || '',
          };
          setInitialValues(normalized);
        } else {
          message.error('Module data not found.');
        }
      } catch (err: any) {
        message.error(err?.message || 'Failed to fetch module');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchModule();
    }
  }, []);

  const getKeywords = async () => {
    try {
      const response = await keyword.get(KEYWORDS_API);
      const data = response?.data.data.map((keyword: { [key: string]: any }) => {
        return { label: keyword.name, value: keyword.id };
      });
      setKeywords(data);
    } catch (err: any) {
      message.error(err?.message || 'Failed to fetch keywords');
    }
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validate: (values) => validate(values, rules),
  });
  const handleSubmit = async (values: ModuleForm) => {
    try {
      setIsLoading(true);
      const payload = { ...values };
      if (payload.keywordIds.length === 0) {
        delete payload.keywordIds;
      }
      if (id) {
        payload['id'] = id;
        const response = await api.updateModule(payload);
        const data = response?.data;
        if (data) {
          message.success('Module updated successfully.');

          navigate(MODULES_ROUTES.CONTENT.BASE.replace(':id', data.id));
        }
      } else {
        const response = await api.createModule(payload);
        const data = response?.data;
        if (data) {
          message.success('Module created successfully.');

          navigate(MODULES_ROUTES.CONTENT.BASE.replace(':id', data.id));
        }
      }
    } catch (err: any) {
      message.error(err?.message || 'Failed to save module.');
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(`${id ? 'Edit' : 'Add'} Module`);
    setActions([
      <Space size={'small'}>
        <Button
          key="cancel"
          text="Cancel"
          size="small"
          type={ButtonType.DEFAULT}
          onClick={() => navigate(MODULES_ROUTES.BASE)}
        />
        <Button
          key="save"
          onClick={formik.handleSubmit}
          htmlType="submit"
          text="Save"
          size="small"
          type={ButtonType.PRIMARY}
        />
      </Space>,
    ]);
    setBreadcrumbs([
      {
        label: 'Modules Management',
        onClick: () => navigate(MODULES_ROUTES.BASE),
      },
      {
        label: `${id ? 'Edit' : 'Add New'} Module`,
        onClick: () => {},
        active: true,
      },
    ]);
  }, []);

  return (
    <>
      {isLoading && <FullPageLoader fullscreen={true} />}
      <Row>
        <Col sm={{ span: 24 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
          <Card title="Module detail">
            <Row>
              <Col sm={{ span: 24 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
                <form onSubmit={formik.handleSubmit}>
                  <Row gutter={[24, 12]}>
                    <Col span={12}>
                      <AntInput
                        label="Module name"
                        required
                        placeholder="Enter module name"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && formik.errors.title}
                      />
                    </Col>
                    <Col span={12}>
                      <AntDropdown
                        label="Link Keywords"
                        options={keywords}
                        style={{ width: '100%' }}
                        placeholder="Select"
                        multiple
                        name="keywordIds"
                        value={formik.values.keywordIds}
                        onChange={(value) => {
                          formik.setFieldValue('keywordIds', value);
                        }}
                        onBlur={() => formik.setFieldTouched('keywordIds', true)}
                        error={
                          typeof formik.errors.keywordIds === 'string'
                            ? formik.touched.keywordIds && formik.errors.keywordIds
                            : undefined
                        }
                      />
                    </Col>
                    <Col span={24}>
                      <AntTextArea
                        label="Description"
                        required
                        placeholder="Enter description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && formik.errors.description}
                      />
                    </Col>
                    <Col span={24}>
                      <FileUpload
                        label="Thumbnail"
                        type="image"
                        required
                        name="thumbnail"
                        value={formik.values.thumbnail}
                        onChange={(value) => {
                          console.log('value', value);
                        }}
                        onBlur={formik.handleBlur}
                        error={formik.touched.thumbnail && formik.errors.thumbnail}
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

export default AddModule;
