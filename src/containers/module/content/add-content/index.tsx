import {
  Button,
  TextArea,
  Input,
  Dropdown as AntDropdown,
  FileUploader,
  Card,
} from '@/components/ui';
import { useHeader } from '@/context/header';
import type { FileInfo, Question } from '@/types/content';
import { Col, Row, Space } from 'antd';

import { useEffect, useRef, useState } from 'react';

import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

import { useMessage } from '@/context/message';
import { useFormik } from 'formik';
import { handleUploadFile, validate } from '@/utils';

import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/content-api';
import { MODULES_ROUTES } from '@/constants/route';
import FullPageLoader from '@/components/ui/spin';
import modulesManagementServices from '@/services/modules-management';
import FileUpload from '@/components/ui/file-uploader';
import { ModuleContentType } from '@/constants/module';
import { ButtonType } from '@/constants/button';
import Questionnaire from './questionnaire';

const contentTypes = [
  ModuleContentType.Video,
  ModuleContentType.Audio,
  ModuleContentType.Document,
  ModuleContentType.Link,
] as const;

const AddContent = () => {
  const message = useMessage();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const { id, categoryId } = useParams<{ id: string; categoryId: string }>();
  const [contentData, setContentData] = useState(null);
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    sessionNo: 0,
    contentType: ModuleContentType.Video,
    thumbnail: '',
    url: '',
    questions: [],
  });
  const [thumbnailDetails, setThumbnailDetails] = useState<{
    isEditMode: boolean;
    file: File;
    fileInfo: FileInfo;
  } | null>(null);

  const [urlDetails, setUrlDetails] = useState<{
    isEditMode: boolean;
    file: File;
    fileInfo: FileInfo;
  } | null>(null);

  const { setTitle, setActions, setBreadcrumbs, setSubtitle } = useHeader();
  const [questionnaireStatus, setQuestionnaireStatus] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mediaLength, setMediaLength] = useState<number>(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctId, setCorrectId] = useState<number[]>([]);
  const [idTracker, setIdTracker] = useState<number | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    index?: number;
    questionText?: string;
  }>({
    open: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState<number>(0);
  const optionRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const fetched = useRef({
    module: false,
    content: false,
    contentList: false,
  });
  const sensors = useSensors(useSensor(PointerSensor));

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validate: (values) => {
      const rules = {
        title: {
          required: { value: true, message: 'Title is required.' },
          min: { value: 3, message: 'Name must be between 3 and 50 characters.' },
          max: { value: 50, message: 'Name must be between 3 and 50 characters.' },
        },
        description: {
          required: { value: true, message: 'Description is required.' },
          min: { value: 3, message: 'Description must be at least 3 characters.' },
          max: { value: 500, message: 'Description must not exceed 500 characters.' },
        },
        sessionNo: {
          required: { value: true, message: 'Session number is required.' },
        },
        thumbnail: {
          required: { value: true, message: 'Banner image is required.' },
        },
        contentType: {
          required: { value: true, message: 'Content type is required.' },
        },
        url: {
          required: {
            value: true,
            message:
              values.contentType === ModuleContentType.Link
                ? 'Please enter a valid link.'
                : `Please upload a valid ${values.contentType.toLowerCase()} file.`,
          },
          ...(values.contentType === ModuleContentType.Link && {
            pattern: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[^\s]*)?$/i,
          }),
        },
      };

      return validate(values, rules);
    },
  });

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const payload = { ...values };
      payload['questions'] = questions || [];
      if (thumbnailDetails?.file) {
        const key = await handleUploadFile(thumbnailDetails.file, thumbnailDetails.fileInfo);
        payload.thumbnail = key;
      }
      if (urlDetails?.file) {
        const key = await handleUploadFile(urlDetails.file, urlDetails.fileInfo);
        payload.url = key;
      }
      payload['categoryId'] = categoryId;
      payload['questionnaireStatus'] = questionnaireStatus;
      payload['length'] = +mediaLength;
      payload['sessionNo'] = +payload['sessionNo'];
      if (
        payload.contentType === ModuleContentType.Link ||
        payload.contentType === ModuleContentType.Document
      ) {
        payload['questions'] = [];
      }
      if (id) {
        payload['id'] = id;
        const response = await api.updateContent(payload);
        const data = response?.data;
        if (data) {
          message.success('Content updated successfully.');
          navigate(MODULES_ROUTES.CONTENT.BASE.replace(':id', categoryId));
        }
      } else {
        const response = await api.createContent(payload);
        const data = response?.data;
        if (data) {
          message.success('Content created successfully');
          navigate(MODULES_ROUTES.CONTENT.BASE.replace(':id', categoryId));
        }
      }
    } catch (error: any) {
      message.error(error?.message || 'Failed to save content.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await modulesManagementServices.getModule(categoryId);
        setIsLoading(true);
        const data = response?.data;
        if (data) {
          setModule(data);
        } else {
          message.error('Module data not found.');
        }
      } catch (err: any) {
        message.error(err?.message || 'Failed to fetch module');
      } finally {
        setIsLoading(false);
      }
    };
    if (!fetched.current.module) {
      fetchModule();
      fetched.current.module = true;
    }
  }, [categoryId]);

  useEffect(() => {
    setTitle('New Content');
    setSubtitle('');
    setActions([
      <Space size={'small'}>
        <Button
          key="cancel"
          text="Cancel"
          size="small"
          type={ButtonType.DEFAULT}
          onClick={() => {
            navigate(MODULES_ROUTES.CONTENT.BASE.replace(':id', categoryId));
          }}
        />
        <Button
          key="save"
          onClick={() => formik.handleSubmit()}
          htmlType="submit"
          text="Save"
          size="small"
          type={ButtonType.PRIMARY}
        />
      </Space>,
    ]);
    setBreadcrumbs([
      {
        label: module?.title || 'N/A',
        onClick: () => {
          navigate(MODULES_ROUTES.CONTENT.BASE.replace(':id', categoryId));
        },
      },
      {
        label: `${id ? 'Edit' : 'Add New'} Content`,
        onClick: () => {},
        active: true,
      },
    ]);
    if (!fetched.current.contentList) {
      getContentList();
      fetched.current.contentList = true;
    }
    if (id && !fetched.current.content) {
      getContentDetails();
      fetched.current.content = true;
    }
  }, [module]);

  const generateSessionOptions = () => {
    const count = id ? itemCount : itemCount + 1;

    return Array.from({ length: count }, (_, i) => ({
      label: `${i + 1}`,
      value: i + 1,
    }));
  };

  const getContentDetails = async () => {
    try {
      setIsLoading(true);
      const result = await api.getContent(id);
      const data = result?.data;
      if (data) {
        setThumbnailDetails((prev) => ({
          ...prev,
          isEditMode: true,
        }));
        setUrlDetails((prev) => ({
          ...prev,
          isEditMode: true,
        }));
        setContentData(data);
        const questionsData = data.questions.map((q) => {
          return {
            questionText: q.questionText,
            options: q.options.map((o) => {
              return {
                optionValue: o.optionValue,
                isCorrect: o.isCorrect,
                optionOrder: o.optionOrder,
              };
            }),
          };
        });
        const contentData = {
          title: data.title,
          description: data.description,
          sessionNo: data.sessionNo,
          contentType: data.contentType,
          thumbnail: data.thumbnail,
          url: data.url,
          questions: questionsData || [],
        };
        setInitialValues(contentData as any);
        setQuestionnaireStatus(data?.questionnaireStatus);
        data?.questions?.length > 0 && setQuestions(questionsData);
      }
    } catch (error) {
      message.error('Failed to fetch content details');
    } finally {
      setIsLoading(false);
    }
  };

  const getContentList = async () => {
    try {
      const result = await modulesManagementServices.getModuleContents({
        categoryId: categoryId,
        page: 1,
        take: 10,
      });
      const meta = result?.data?.meta || {};
      setItemCount((meta as any).itemCount || 0);
      !id && setInitialValues((prev) => ({ ...prev, sessionNo: (meta as any).itemCount + 1 }));
    } catch (error) {
      message.error('Failed to fetch content list');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <FullPageLoader fullscreen={true} />}
      <Row gutter={16}>
        {/* Left Side - Content Detail */}
        <Col
          span={
            formik.values.contentType === ModuleContentType.Video ||
            formik.values.contentType === ModuleContentType.Audio
              ? 16
              : 24
          }
        >
          <Card title="Content Details">
            <form onSubmit={formik.handleSubmit}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Row gutter={[16, 0]} justify={'space-between'} align={'middle'}>
                    <Col span={12}>
                      <label>
                        Content Type <span className="error">*</span>
                      </label>
                    </Col>
                    <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Space>
                        {contentTypes.map((type) => (
                          <Button
                            key={type}
                            size="small"
                            className={`content-type-button ${
                              formik.values.contentType === type ? 'selected' : ''
                            }`}
                            type={
                              formik.values.contentType === type
                                ? ButtonType.PRIMARY
                                : ButtonType.SECONDARY_WHITE
                            }
                            onClick={() => {
                              formik.setFieldValue('contentType', type);
                            }}
                            text={type}
                            disabled={!!id}
                          />
                        ))}
                      </Space>
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Input
                    placeholder={`Enter ${formik.values.contentType} name`}
                    label={`${formik.values.contentType} Name`}
                    name="title"
                    value={formik.values.title}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue('title', value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && formik.errors.title}
                    required
                  />
                </Col>

                <Col span={12}>
                  <AntDropdown
                    placeholder="Select session"
                    style={{ width: '100%' }}
                    options={generateSessionOptions()}
                    value={formik.values.sessionNo}
                    onChange={(value: string | number | (string | number)[]) => {
                      const selectedValue = value as number;
                      formik.setFieldValue('sessionNo', selectedValue);
                    }}
                    allowClear={false}
                    onBlur={() => formik.setFieldTouched('sessionNo', true)}
                    error={formik.touched.sessionNo && formik.errors.sessionNo}
                    required
                    name="sessionNo"
                    label="Session No."
                  />
                </Col>
                <Col span={24}>
                  <TextArea
                    rows={6}
                    placeholder="Enter description"
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={(e) => {
                      const value = e.target.value;
                      formik.setFieldValue('description', value);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && formik.errors.description}
                    required
                  />
                </Col>

                <Col span={24}>
                  <FileUpload
                    label="Banner"
                    required
                    type={ModuleContentType.Image}
                    maxSizeMB={2}
                    fileDetails={(value) => {
                      setThumbnailDetails(value);
                    }}
                    isEditMode={thumbnailDetails?.isEditMode}
                    value={formik.values.thumbnail}
                    accessUrl={contentData?.thumbnailAccessUrl || ''}
                    onChange={(value) => {
                      setThumbnailDetails((prev) => ({
                        ...prev,
                        isEditMode: false,
                      }));
                      formik.setFieldValue('thumbnail', value);
                    }}
                    onBlur={() => formik.handleBlur({ target: { name: 'thumbnail' } })}
                    error={formik.touched.thumbnail && formik.errors.thumbnail}
                  />
                </Col>

                <Col span={24}>
                  {formik.values.contentType === ModuleContentType.Link && (
                    <Input
                      placeholder="Enter link"
                      value={formik.values.url}
                      label="Link"
                      name={formik.values.contentType}
                      required
                      error={formik.touched.url && formik.errors.url}
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        const value = e.target.value;
                        formik.setFieldValue('url', value);
                      }}
                    />
                  )}
                  {formik.values.contentType !== ModuleContentType.Link && (
                    <FileUploader
                      name={formik.values.contentType}
                      type={formik.values.contentType}
                      maxCount={1}
                      maxSizeMB={
                        formik.values.contentType === ModuleContentType.Document
                          ? 50
                          : formik.values.contentType === ModuleContentType.Audio
                            ? 20
                            : 200
                      }
                      label={`Upload ${formik.values.contentType}`}
                      value={formik.values.url}
                      isEditMode={urlDetails?.isEditMode}
                      fileDetails={(value) => {
                        setUrlDetails(value);
                      }}
                      accessUrl={contentData?.contentAccessUrl || ''}
                      mediaLength={(length) => {
                        setMediaLength(length);
                      }}
                      onChange={(value) => {
                        setUrlDetails((prev) => ({
                          ...prev,
                          isEditMode: false,
                        }));
                        formik.setFieldValue('url', value);
                      }}
                      onBlur={() => formik.handleBlur({ target: { name: 'url' } })}
                      error={formik.touched.url && formik.errors.url}
                    />
                  )}
                </Col>
              </Row>
            </form>
          </Card>
        </Col>

        {/* Right Side - Questionnaire */}
        {(formik.values.contentType === ModuleContentType.Video ||
          formik.values.contentType === ModuleContentType.Audio) && (
          <Col span={8}>
            <Questionnaire
              questions={questions}
              questionnaireStatus={questionnaireStatus}
              setQuestionnaireStatus={setQuestionnaireStatus}
              options={options}
              setOptions={setOptions}
              correctId={correctId}
              setCorrectId={setCorrectId}
              question={question}
              setQuestion={setQuestion}
              idTracker={idTracker}
              setIdTracker={setIdTracker}
              setInitialValues={setInitialValues}
              setQuestions={setQuestions}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              confirmModal={confirmModal}
              setConfirmModal={setConfirmModal}
              optionRefs={optionRefs}
              sensors={sensors}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default AddContent;
