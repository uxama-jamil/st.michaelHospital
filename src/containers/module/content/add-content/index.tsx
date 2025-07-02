import {
  Button,
  TextArea,
  Input,
  Dropdown as AntDropdown,
  FileUploader,
  DialogBox,
  Card,
  Empty,
} from '@/components/ui';
import { useHeader } from '@/context/header';
import type { Question } from '@/types/content';
import { Checkbox, Col, Dropdown, Form, Menu, Modal, Radio, Row, Space, Switch } from 'antd';
import { DeleteOutlined, EllipsisOutlined, MoreOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

import { useEffect, useState } from 'react';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMessage } from '@/context/message';
import { useFormik } from 'formik';
import { validate } from '@/utils';
import { useModule } from '@/context/module';
import { mockImages as images } from '@/constants/image-links';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/content-api';
import { MODULES_ROUTES } from '@/constants/route';
import FullPageLoader from '@/components/ui/spin';
import modulesManagementServices from '@/services/modules-management';
import FileUpload from '@/components/ui/file-uploader';
import { ModuleContentType } from '@/constants/module';
import { ButtonType } from '@/constants/button';

const contentTypes = [
  ModuleContentType.Video,
  ModuleContentType.Audio,
  ModuleContentType.Document,
  ModuleContentType.Link,
] as const;

const SortableOption = ({
  id,
  option,
  onDelete,
  onChange,
  listeners,
  attributes,
  setNodeRef,
  style,
}) => {
  return (
    <Row ref={setNodeRef} style={style} className={styles.optionContainer} {...attributes}>
      <Col span={1}>
        <Checkbox value={id} />
      </Col>
      <Col span={17}>
        <Input
          value={option.optionValue}
          className={styles.optionInput}
          onChange={(e) => onChange(id, e.target.value)}
        />
      </Col>
      <Col span={2}>
        <EllipsisOutlined className={styles.ellipsis} {...listeners} />
      </Col>
      <Col span={2}>
        <DeleteOutlined className={styles.delete} onClick={() => onDelete(id)} />
      </Col>
    </Row>
  );
};

const SortableItemWrapper = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  return children({ id, attributes, listeners, setNodeRef, style });
};

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
  const { setTitle, setActions, setBreadcrumbs } = useHeader();
  const [questionnaireStatus, setQuestionnaireStatus] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correctId, setCorrectId] = useState<string[] | number[]>([]);
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

  const sensors = useSensors(useSensor(PointerSensor));
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
      required: { value: true, message: 'Banner image is required..' },
    },
    contentType: {
      required: { value: true, message: 'Content type is required.' },
    },
    url: {
      required: {
        value: true,
        message: `Please upload a valid ${initialValues.contentType.toLowerCase()} file.`,
      },
    },
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    validate: (values) => validate(values, rules),
  });

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      const payload = { ...values };
      payload['categoryId'] = categoryId;
      payload['questionnaireStatus'] = questionnaireStatus;
      payload['length'] = 10;
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

  const handleAddOption = () => {
    const newId = (Math.random() + 1).toString(36).substring(7);
    setOptions([...options, { optionOrder: newId, optionValue: '', isCorrect: false }]);
  };

  const handleDeleteOption = (id) => {
    setOptions((prev) => prev.filter((opt) => opt.optionOrder !== id));
    if (correctId === id) setCorrectId(null);
  };

  const handleOptionChange = (id, value) => {
    const updated = options.map((opt) =>
      opt.optionOrder === id ? { ...opt, optionValue: value } : opt,
    );
    setOptions(updated);
  };

  const handleRadioChange = (e) => {
    setCorrectId(e.target.value);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((item) => item.optionOrder === active.id);
    const newIndex = options.findIndex((item) => item.optionOrder === over.id);
    setOptions(arrayMove(options, oldIndex, newIndex));
  };

  const handleSave = () => {
    if (!question || options.some((o) => !o.optionValue)) {
      message.error('Please fill in the question and all options.');
      return;
    }
    if (options.length < 2) {
      message.error('Please add at least two options.');
      return;
    }
    if (!options.some((o) => o.isCorrect)) {
      message.error('Please select at least one correct answer.');
      return;
    }

    const formatted = options.map((opt, i) => ({
      optionValue: opt.optionValue,
      optionOrder: i,
      isCorrect: correctId.includes(opt.optionOrder),
    }));

    const payload = {
      questionText: question,
      options: formatted,
    };
    message.success('Question saved!');

    // Always update local state
    setQuestions((prev) => {
      const updated = [...prev];
      if (idTracker !== null) {
        updated[idTracker] = payload;
      } else {
        updated.push(payload);
      }
      return updated;
    });

    // Always update Formik initial values
    setInitialValues((prev) => {
      const updatedQuestions = [...prev.questions];
      if (idTracker !== null) {
        updatedQuestions[idTracker] = payload;
      } else {
        updatedQuestions.push(payload);
      }

      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
    setIsModalVisible(false);
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

    fetchModule();
  }, [categoryId]);

  useEffect(() => {
    setTitle('New Content');
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
        onClick: () => {},
      },
      {
        label: 'Add New Content',
        onClick: () => {},
        active: true,
      },
    ]);
    getContentList();
    id && getContentDetails();
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
        setContentData(data);
        setInitialValues(data);
        setQuestionnaireStatus(data?.questionnaireStatus);
        data?.questions?.length > 0 &&
          setQuestions((prev) => {
            const formatted = data.questions.map((q) => {
              return {
                questionText: q.questionText,
                options: q.options,
              };
            });
            return formatted;
          });
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

  const addNewQuestion = () => {
    setIsModalVisible(true);
    setQuestion('');
    setOptions([]);
    setCorrectId(null);
    setIdTracker(null);
  };
  const editQuestion = (question: Question, index: number) => {
    const correctOptionIds = question.options.filter((o) => o.isCorrect).map((o) => o.optionOrder);
    setIsModalVisible(true);
    setQuestion(question.questionText);
    setOptions(question.options);
    setCorrectId(correctOptionIds);
    setIdTracker(index);
  };

  const handleDeleteConfirmed = () => {
    if (typeof confirmModal.index === 'number') {
      setQuestions((prev) => prev.filter((_, i) => i !== confirmModal.index));
      setInitialValues((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== confirmModal.index),
      }));
      message.success(`Question ${confirmModal.index + 1} deleted`);
    }
    setConfirmModal({ open: false });
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
                            className={styles.button}
                            type={
                              formik.values.contentType === type
                                ? ButtonType.PRIMARY
                                : ButtonType.SECONDARY_WHITE
                            }
                            onClick={() => {
                              formik.setFieldValue('contentType', type);
                              setInitialValues((prev) => ({
                                ...prev,
                                contentType: type,
                              }));
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
                      setInitialValues((prev) => ({
                        ...prev,
                        title: value,
                      }));
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
                    onChange={(value: number) => {
                      const selectedValue = value || 0;
                      formik.setFieldValue('sessionNo', selectedValue);
                      setInitialValues((prev) => ({
                        ...prev,
                        sessionNo: selectedValue,
                      }));
                    }}
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
                      setInitialValues((prev) => ({
                        ...prev,
                        description: value,
                      }));
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
                    maxWidth={1600}
                    maxHeight={1600}
                    value={formik.values.thumbnail}
                    accessUrl={contentData?.thumbnailAccessUrl || ''}
                    onChange={(value) => {
                      formik.setFieldValue('thumbnail', value);
                      setInitialValues((prev) => ({
                        ...prev,
                        thumbnail: value,
                      }));
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
                        setInitialValues((prev) => ({
                          ...prev,
                          url: value,
                        }));
                      }}
                    />
                  )}
                  {formik.values.contentType !== ModuleContentType.Link && (
                    <FileUploader
                      name={formik.values.contentType}
                      type={formik.values.contentType}
                      maxCount={1}
                      maxSizeMB={2}
                      label={`Upload ${initialValues.contentType}`}
                      value={formik.values.url}
                      accessUrl={contentData?.contentAccessUrl || ''}
                      onChange={(value) => {
                        formik.setFieldValue('url', value);
                        setInitialValues((prev) => ({
                          ...prev,
                          url: value,
                        }));
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
            <Card
              title="Questionnaire"
              className={questions.length === 0 ? 'questionsSection' : ''}
              extra={<Switch checked={questionnaireStatus} onChange={setQuestionnaireStatus} />}
            >
              {questions.length === 0 ? (
                <Empty
                  heading="No question added yet"
                  message="Start managing your question by adding your first one."
                  buttonText=""
                  onClick={() => {}}
                />
              ) : (
                <>
                  {questions.map((q, i) => {
                    const menu = (
                      <Menu>
                        <Menu.Item key="edit" onClick={() => editQuestion(q, i)}>
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          key="delete"
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              index: i,
                              questionText: q.questionText,
                            })
                          }
                        >
                          Delete
                        </Menu.Item>
                      </Menu>
                    );
                    return (
                      <div className={styles.questionCard}>
                        <span>{`Question ${i + 1}`}</span>

                        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                          <MoreOutlined className={styles.moreBtn} />
                        </Dropdown>
                      </div>
                    );
                  })}
                </>
              )}
              <Button
                disabled={!questionnaireStatus}
                block
                type={ButtonType.PRIMARY}
                onClick={() => addNewQuestion()}
              >
                {questions.length > 0 ? 'Add Another Question' : 'Add New Question'}
              </Button>

              <DialogBox visible={isModalVisible} setVisible={setIsModalVisible} footer={null}>
                <Form layout="vertical">
                  <Form.Item label="Question" required>
                    <Input
                      placeholder="Enter your question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                  </Form.Item>

                  <Form.Item label="Quiz Options">
                    <Checkbox.Group
                      value={correctId}
                      className={styles.checkboxGroup}
                      onChange={(checkedValues) => {
                        setCorrectId(checkedValues);
                        const updated = options.map((opt) => ({
                          ...opt,
                          isCorrect: checkedValues.includes(opt.optionOrder),
                        }));
                        setOptions(updated);
                      }}
                    >
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={options.map((opt) => opt.optionOrder)}
                          strategy={verticalListSortingStrategy}
                        >
                          <Space direction="vertical" style={{ width: '100%' }}>
                            {options.map((opt, index) => (
                              <SortableItemWrapper key={opt.optionOrder} id={opt.optionOrder}>
                                {({ id, attributes, listeners, setNodeRef, style }) => (
                                  <SortableOption
                                    id={id}
                                    index={index}
                                    option={opt}
                                    onDelete={handleDeleteOption}
                                    onChange={handleOptionChange}
                                    attributes={attributes}
                                    listeners={listeners}
                                    setNodeRef={setNodeRef}
                                    style={style}
                                  />
                                )}
                              </SortableItemWrapper>
                            ))}
                          </Space>
                        </SortableContext>
                      </DndContext>
                    </Checkbox.Group>
                    <Button
                      type={ButtonType.SECONDARY_WHITE}
                      onClick={handleAddOption}
                      className={styles.addOptionButton}
                      block
                      style={{ marginTop: 10 }}
                    >
                      + Add Option
                    </Button>
                  </Form.Item>

                  <Form.Item>
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Button
                          type={ButtonType.SECONDARY_WHITE}
                          onClick={() => setIsModalVisible(false)}
                          block
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button type={ButtonType.PRIMARY} onClick={handleSave} block>
                          Save
                        </Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </Form>
              </DialogBox>

              <Modal
                open={confirmModal.open}
                title="Confirm Delete"
                footer={[
                  <Button
                    key="cancel"
                    type={ButtonType.SECONDARY_WHITE}
                    onClick={() => setConfirmModal({ open: false })}
                  >
                    Cancel
                  </Button>,
                  <Button
                    key="confirm"
                    type={ButtonType.PRIMARY}
                    danger
                    onClick={handleDeleteConfirmed}
                  >
                    Delete Question
                  </Button>,
                ]}
                onCancel={() => setConfirmModal({ open: false })}
              >
                {`Are you sure you want to delete the question "${confirmModal.questionText}"?`}
              </Modal>
            </Card>
          </Col>
        )}
      </Row>
    </>
  );
};

export default AddContent;
