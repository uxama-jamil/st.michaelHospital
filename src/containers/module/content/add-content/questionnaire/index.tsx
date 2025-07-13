import { Button, Input, DialogBox, Card, Empty } from '@/components/ui';
import type { Question } from '@/types/content';
import { Checkbox, Col, Dropdown, Form, Menu, Modal, Row, Space, Switch } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import styles from '../style.module.scss';

import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMessage } from '@/context/message';

import { ButtonType } from '@/constants/button';
import { SortableOption, SortableItemWrapper } from '../sortableoption';

const Questionnaire = ({
  questions,
  questionnaireStatus,
  setQuestionnaireStatus,
  options,
  setOptions,
  correctId,
  setCorrectId,
  question,
  setQuestion,
  idTracker,
  setIdTracker,
  setInitialValues,
  setQuestions,
  setIsModalVisible,
  isModalVisible,
  confirmModal,
  setConfirmModal,
  optionRefs,
  sensors,
}) => {
  const message = useMessage();
  const handleDeleteOption = (id) => {
    setOptions((prev) => prev.filter((opt) => opt.optionOrder !== id));
    if (correctId === id) setCorrectId(null);
  };

  const handleOptionChange = (id, value) => {
    const updated = options.map((opt) =>
      opt.optionOrder === id ? { ...opt, optionValue: value.trimStart() } : opt,
    );
    setOptions(updated);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = options.findIndex((item) => item.optionOrder === active.id);
    const newIndex = options.findIndex((item) => item.optionOrder === over.id);
    setOptions(arrayMove(options, oldIndex, newIndex));
  };
  const handleAddOption = () => {
    const newId = (Math.random() + 1).toString(36).substring(7);
    const newOption = { optionOrder: newId, optionValue: '', isCorrect: false };

    setOptions((prev) => {
      const updated = [...prev, newOption];
      // Wait for DOM update then focus
      setTimeout(() => {
        optionRefs.current[newId]?.focus();
      }, 0);
      return updated;
    });
  };
  const handleSave = () => {
    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map((opt) => ({
      ...opt,
      optionValue: opt.optionValue.trim(),
    }));

    if (!trimmedQuestion) {
      message.error('Question cannot be empty or whitespace.');
      return;
    }

    if (trimmedOptions.some((o) => !o.optionValue)) {
      message.error('All options must have non-empty values.');
      return;
    }

    if (trimmedOptions.length < 2) {
      message.error('Please add at least two options.');
      return;
    }

    if (!trimmedOptions.some((o) => o.isCorrect)) {
      message.error('Please select at least one correct answer.');
      return;
    }

    const formatted = trimmedOptions.map((opt, i) => ({
      optionValue: opt.optionValue,
      optionOrder: i,
      isCorrect: correctId.includes(opt.optionOrder),
    }));

    const payload = {
      questionText: trimmedQuestion,
      options: formatted,
    };

    // Save to state
    setQuestions((prev) => {
      const updated = [...prev];
      if (idTracker !== null) {
        updated[idTracker] = payload;
      } else {
        updated.push(payload);
      }
      return updated;
    });

    setIsModalVisible(false);
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
    }
    setConfirmModal({ open: false });
  };
  return (
    <>
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
                onChange={(e) => setQuestion(e.target.value.trimStart())}
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
                      {options.map((opt) => (
                        <SortableItemWrapper key={opt.optionOrder} id={opt.optionOrder}>
                          {({ id, attributes, listeners, setNodeRef, style }) => (
                            <SortableOption
                              id={id}
                              option={opt}
                              onDelete={handleDeleteOption}
                              onChange={handleOptionChange}
                              attributes={attributes}
                              listeners={listeners}
                              setNodeRef={setNodeRef}
                              style={style}
                              inputRef={(el) => (optionRefs.current[id] = el)}
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
            <Button key="confirm" type={ButtonType.PRIMARY} danger onClick={handleDeleteConfirmed}>
              Delete Question
            </Button>,
          ]}
          onCancel={() => setConfirmModal({ open: false })}
        >
          {`Are you sure you want to delete the question "${confirmModal.questionText}"?`}
        </Modal>
      </Card>
    </>
  );
};

export default Questionnaire;
