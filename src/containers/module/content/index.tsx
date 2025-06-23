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
import { useModule } from '@/context/module';
import { useMessage } from '@/context/message';
import { Button } from '@/components/ui';
import FullPageLoader from '@/components/ui/spin';
import { getContentHeight } from '@/utils';
import { ModuleContentStatus } from '@/constants/module';
import { ButtonType } from '@/constants/button';

const PAGE_SIZE = 12;

const ModuleContentList: React.FC = () => {
  const [contents, setContents] = useState<ModuleContent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const message = useMessage();
  const [module, setModule] = useState(null);
  const { setTitle, setActions, setBreadcrumbs } = useHeader();
  const [contentHeight, setContentHeight] = useState(400);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; item?: ModuleContent }>({
    open: false,
  });
  const [publishLoading, setPublishLoading] = useState(false);
  const { id: categoryId } = useParams<{ id: string }>();

  const fetchContents = useCallback(
    async (reset = false) => {
      if (isLoading || (!reset && !hasMore)) return;
      setIsLoading(true);
      const pageToFetch = reset ? 1 : currentPage;

      const payload = {
        order: 'ASC',
        page: pageToFetch,
        take: PAGE_SIZE,
        categoryId,
      };

      try {
        const result = await modulesManagementServices.getModuleContents(payload);
        const items = result?.data?.data || [];
        const meta = result?.data?.meta || {};

        if (items.length > 0) {
          setContents((prev) => (reset ? items : [...prev, ...items]));
          setHasMore(meta.hasNextPage);
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
                loading={publishLoading}
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
                loading={publishLoading}
              />
            )}
          </>
        }
        <Button
          key="Add New Content"
          onClick={() => navigate(MODULES_ROUTES.CONTENT.ADD.replace(':categoryId', categoryId))}
          htmlType="button"
          text="Add New Content"
          size="small"
          type={ButtonType.PRIMARY}
        />
      </Space>
    );

    setActions([actions]);
    setBreadcrumbs([]);
    console.log('contents.length', contents.length);

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
        const deletedItem = contents.find((item) => item.id === id);
        await modulesManagementServices.deleteContent(id);
        message.success(`${deletedItem?.title} deleted successfully.`);
        fetchContents(true);
      } catch (error) {
        message.showError(error, 'Failed to delete the content.');
      }
    },
    [fetchContents, message],
  );

  const handlePublish = useCallback(
    async (status: 'Draft' | 'Published') => {
      setPublishLoading(true);
      try {
        await modulesManagementServices.publishContent(module?.id, status);
        status === ModuleContentStatus.Published
          ? message.success(`Module published successfully.`)
          : message.success(`Module saved as draft successfully.`);
        console.log('status', status);
        fetchModule();
        fetchContents(true);
      } catch (error) {
        message.showError(error, `Failed to update the module ${status}.`);
      } finally {
        setPublishLoading(false);
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
            onClick={() => navigate(MODULES_ROUTES.CONTENT.ADD.replace(':categoryId', categoryId))}
          />
        </Col>
      </Row>
    );
  }

  return (
    <>
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
                      onDelete={() => setConfirmModal({ open: true, item })}
                      onEdit={() =>
                        navigate(
                          MODULES_ROUTES.CONTENT.EDIT.replace(':id', item.id).replace(
                            ':categoryId',
                            categoryId,
                          ),
                        )
                      }
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
