import React, { useEffect, useState, useCallback } from 'react';
import { List, Row, Col, Space, Modal } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import Empty from '@/components/ui/empty';
import { useNavigate, useParams } from 'react-router-dom';
import { MODULES_ROUTES } from '@/constants/route';
import CardContent from '@/components/ui/card-content';
import type { ModuleContent } from '@/types/modules';
import modulesManagementServices from '@/services/modules-management';
import { useHeader } from '@/context/header';
import { useMessage } from '@/context/message';
import { Button } from '@/components/ui';
import FullPageLoader from '@/components/ui/spin';
import { getContentHeight } from '@/utils';
import { ModuleContentStatus } from '@/constants/module';
import { ButtonType } from '@/constants/button';
import { MODULE_CONTENT_ORDER, MODULE_CONTENT_PAGE_SIZE } from '@/constants/api';

const ModuleContentList: React.FC = () => {
  const [contents, setContents] = useState<ModuleContent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const message = useMessage();
  const [module, setModule] = useState(null);
  const { setTitle, setActions, setBreadcrumbs, setSubtitle } = useHeader();
  const [contentHeight, setContentHeight] = useState(400);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; item?: ModuleContent }>({
    open: false,
  });

  const { id: categoryId } = useParams<{ id: string }>();

  const fetchContents = useCallback(
    async (reset = false) => {
      if (isLoading || (!reset && !hasMore)) return;
      setIsLoading(true);
      const pageToFetch = reset ? 1 : currentPage;

      const payload = {
        order: MODULE_CONTENT_ORDER,
        page: pageToFetch,
        take: MODULE_CONTENT_PAGE_SIZE,
        categoryId,
      };

      try {
        const result = await modulesManagementServices.getModuleContents(payload);
        const items = result?.data?.data || [];
        const meta = result?.data?.meta;
        setTotal(meta?.itemCount);
        if (items.length > 0) {
          setContents((prev) => (reset ? items : [...prev, ...items]));
          setHasMore(meta?.hasNextPage);
          setCurrentPage(reset ? 2 : currentPage + 1);
        } else {
          if (reset) setContents([]);
          setHasMore(false);
        }
      } catch (error) {
        message.showError(error, 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, hasMore, isLoading, message],
  );

  useEffect(() => {
    if (!module) return;

    setTitle(module.title);
    setBreadcrumbs([]);
    setSubtitle(`Total: ${total}`);
    const actions = (
      <Space size="small">
        <Button
          key="Back"
          text="Back"
          size="small"
          type={ButtonType.DEFAULT}
          onClick={() => navigate(MODULES_ROUTES.BASE)}
        />
        {
          <>
            {module.status === ModuleContentStatus.Draft && (
              <Button
                key="Publish Module"
                onClick={() => handlePublish(ModuleContentStatus.Published)}
                htmlType="button"
                text="Publish Module"
                disabled={contents.length === 0}
                size="small"
                type={ButtonType.SECONDARY}
              />
            )}
            {module.status === ModuleContentStatus.Published && (
              <Button
                key="Draft Module"
                onClick={() => handlePublish(ModuleContentStatus.Draft)}
                htmlType="button"
                text="Save as draft"
                size="small"
                type={ButtonType.SECONDARY}
              />
            )}
          </>
        }
        <Button
          key="Add New Content"
          onClick={() =>
            navigate(
              MODULES_ROUTES.CONTENT.ADD.replace(':categoryId', encodeURIComponent(categoryId)),
            )
          }
          htmlType="button"
          text="Add New Content"
          size="small"
          type={ButtonType.PRIMARY}
        />
      </Space>
    );

    setActions([actions]);
    setBreadcrumbs([]);

    const updateHeight = () => setContentHeight(getContentHeight());
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [module, contents.length, setTitle, setActions, setBreadcrumbs, navigate]);

  useEffect(() => {
    setCurrentPage(1);
    fetchContents(true);
    fetchModule();
    // eslint-disable-next-line
  }, []);

  const fetchModule = async () => {
    try {
      const response = await modulesManagementServices.getModule(categoryId);
      const data = response?.data;
      if (data) {
        // Normalize data for form fields
        setModule(data);
      } else {
        message.error('Module data not found.');
      }
    } catch (err: any) {
      message.error(err?.message || 'Failed to fetch module');
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setConfirmModal({ open: false });
        setIsLoading(true);
        const deletedItem = contents.find((item) => item.id === id);
        await modulesManagementServices.deleteContent(id);
        message.success(`${deletedItem?.title} deleted successfully.`);
        fetchContents(true);
      } catch (error) {
        message.showError(error, 'Failed to delete the content.');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchContents, message],
  );

  const handlePublish = useCallback(
    async (status: ModuleContentStatus) => {
      setIsLoading(true);
      try {
        await modulesManagementServices.publishContent(module?.id, status);
        status === ModuleContentStatus.Published
          ? message.success(`Module published successfully.`)
          : message.success(`Module saved as draft successfully.`);
        fetchModule();
        fetchContents(true);
      } catch (error) {
        message.showError(error, `Failed to update the module ${status}.`);
      } finally {
        setIsLoading(false);
      }
    },
    [message, fetchContents, module],
  );

  if (isLoading && contents.length === 0) {
    return <FullPageLoader fullscreen={true} />;
  }

  if (!isLoading && contents.length === 0) {
    return (
      <Row align="middle" justify="center" gutter={[16, 16]}>
        <Col span={24}>
          <Empty
            heading="No video & audio added yet"
            message="Start managing your modules by adding your first one."
            buttonText="Add New Content"
            onClick={() =>
              navigate(
                MODULES_ROUTES.CONTENT.ADD.replace(':categoryId', encodeURIComponent(categoryId)),
              )
            }
          />
        </Col>
      </Row>
    );
  }

  return (
    <>
      {isLoading && <FullPageLoader fullscreen={true} />}
      <Row>
        <Col span={24}>
          <div
            id="ContentList"
            style={{
              height: contentHeight,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <InfiniteScroll
              dataLength={contents.length}
              next={() => fetchContents()}
              hasMore={hasMore}
              loader={
                hasMore && isLoading ? (
                  <Row align={'middle'} justify={'center'}>
                    <Col span={24}>
                      <FullPageLoader fullscreen={false} />
                    </Col>
                  </Row>
                ) : null
              }
              scrollableTarget="ContentList"
            >
              <List
                grid={{ gutter: [24, 16], xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
                dataSource={contents}
                locale={{
                  emptyText: (
                    <Empty
                      heading="No users added yet"
                      message="Start adding users by adding your first one."
                      buttonText="Add New User"
                      onClick={() => {
                        navigate(MODULES_ROUTES.CONTENT.ADD);
                      }}
                    />
                  ),
                }}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    <CardContent
                      {...item}
                      contentType={item.contentType}
                      onDelete={() => {
                        module.status === ModuleContentStatus.Published
                          ? message.error(
                              'The module cannot be modified after it has been published, please revert to draft to make changes to it',
                            )
                          : setConfirmModal({ open: true, item });
                      }}
                      onEdit={() => {
                        module.status === ModuleContentStatus.Published
                          ? message.error(
                              'The module cannot be modified after it has been published, please revert to draft to make changes to it',
                            )
                          : navigate(
                              MODULES_ROUTES.CONTENT.EDIT.replace(
                                ':id',
                                encodeURIComponent(item.id),
                              ).replace(':categoryId', encodeURIComponent(categoryId)),
                            );
                      }}
                    />
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
        </Col>
      </Row>
      <Modal
        open={confirmModal.open}
        title="Confirm"
        footer={[
          <Button
            key="cancel"
            type={ButtonType.DEFAULT}
            onClick={() => setConfirmModal({ open: false })}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type={ButtonType.PRIMARY}
            onClick={async () => {
              if (confirmModal.item) {
                await handleDelete(confirmModal.item.id);
              }
              setConfirmModal({ open: false });
            }}
          >
            Delete Content
          </Button>,
        ]}
        onCancel={() => setConfirmModal({ open: false })}
      >
        {`Are you sure you want to delete content "${confirmModal.item?.title}"?`}
      </Modal>
    </>
  );
};

export default ModuleContentList;
