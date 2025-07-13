import React, { useEffect, useState, useCallback } from 'react';
import { List, Row, Col, Space, Modal } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

import Empty from '@/components/ui/empty';
import { useNavigate, useParams } from 'react-router-dom';
import { PLAYLIST_ROUTES } from '@/constants/route';
import CardContent from '@/components/ui/card-content';
import type { Content } from '@/types/playlist';
import playListServices from '@/services/playlist-api';
import { useHeader } from '@/context/header';
import { useMessage } from '@/context/message';
import { Button } from '@/components/ui';
import FullPageLoader from '@/components/ui/spin';
import { getContentHeight } from '@/utils';
import { ButtonType } from '@/constants/button';
import { ModuleContentStatus, ModuleContentType } from '@/constants/module';
import { PLAYLIST_CONTENT_ORDER, PLAYLIST_CONTENT_PAGE_SIZE } from '@/constants/api';

const PlaylistDetail: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [contentHeight, setContentHeight] = useState(400);
  const [playlist, setPlaylist] = useState<any>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; item?: Content }>({
    open: false,
  });

  const navigate = useNavigate();
  const message = useMessage();
  const { setTitle, setActions, setBreadcrumbs, setSubtitle } = useHeader();
  const { id: playListId } = useParams<{ id: string }>();

  // Fetch playlist contents
  const fetchContents = useCallback(
    async (reset = false) => {
      if (isLoading || (!reset && !hasMore)) return;
      setIsLoading(true);
      const pageToFetch = reset ? 1 : currentPage;

      const payload = {
        order: PLAYLIST_CONTENT_ORDER,
        page: pageToFetch,
        take: PLAYLIST_CONTENT_PAGE_SIZE,
        id: playListId,
      };

      try {
        const result = await playListServices.getPlayListContents(payload);
        const items: Content[] = Array.isArray(result?.data?.data)
          ? (result.data.data as unknown as Content[])
          : [];
        const meta = result?.data?.meta;
        setTotal(meta.itemCount);
        setContents((prev) => (reset ? items : [...prev, ...items]));
        setHasMore(meta.hasNextPage ?? false);
        setCurrentPage(reset ? 2 : currentPage + 1);
      } catch (error) {
        message.showError(error, 'Failed to fetch playlist contents.');
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, hasMore, isLoading, message, playListId],
  );

  // Set header and actions
  useEffect(() => {
    if (!playlist) return;
    setTitle(playlist?.name || '');
    setSubtitle(`Total: ${total}`);
    setActions([
      <Space size="small" key="actions">
        <Button
          key="Back"
          text="Back"
          size="small"
          type={ButtonType.DEFAULT}
          onClick={() => navigate(PLAYLIST_ROUTES.BASE)}
        />
        <Button
          key="Edit"
          onClick={() => {
            if (playListId) {
              navigate(PLAYLIST_ROUTES.EDIT.replace(':id', encodeURIComponent(playListId)));
            }
          }}
          htmlType="button"
          text="Edit"
          size="small"
          disabled={playlist?.status.toLowerCase() === 'published'}
          type={ButtonType.PRIMARY}
        />

        <>
          {playlist?.status.toLowerCase() === ModuleContentStatus.Draft.toLowerCase() && (
            <Button
              key="Publish Module"
              onClick={() => handlePublish(ModuleContentStatus.Published)}
              htmlType="button"
              text="Publish"
              disabled={contents.length === 0}
              size="small"
              type={ButtonType.SECONDARY}
            />
          )}
          {playlist?.status.toLowerCase() === ModuleContentStatus.Published.toLowerCase() && (
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
      </Space>,
    ]);
    setBreadcrumbs([]);

    const updateHeight = () => setContentHeight(getContentHeight());
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [playlist, contents.length, setTitle, setActions, setBreadcrumbs, navigate, playListId]);

  const handlePublish = async (status: ModuleContentStatus) => {
    setIsLoading(true);
    try {
      await playListServices.publishContent(playListId, status);
      status === 'Published'
        ? message.success(`Playlist published successfully.`)
        : message.success(`Playlist saved as draft successfully.`);
      fetchPlaylist();
      fetchContents(true);
    } catch (error) {
      message.showError(error, `Failed to update the module ${status}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlaylist = async () => {
    try {
      setIsLoading(true);
      const response = await playListServices.getPlayListById(playListId);

      if (response) {
        // Normalize data for form fields
        setPlaylist(response);
      } else {
        message.error('Playlist data not found.');
      }
    } catch (err: any) {
      message.error(err?.message || 'Failed to fetch playlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  // Initial fetch
  useEffect(() => {
    setCurrentPage(1);
    fetchContents(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playListId]);

  // Handle delete content
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const deletedItem = contents.find((item) => item.id === id);
        await playListServices.deletePlayList(id);
        message.success(`"${deletedItem?.title}" deleted successfully.`);
        fetchContents(true);
      } catch (error) {
        message.showError(error, 'Failed to delete the playlist.');
      }
    },
    [fetchContents, message, contents],
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
            message="Start managing your playlist by adding your first one."
            buttonText="Add New Playlist"
            onClick={() => navigate(PLAYLIST_ROUTES.ADD)}
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
            id="PlayList"
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
              style={{ overflow: 'hidden' }}
              loader={
                hasMore && isLoading ? (
                  <Row align="middle" justify="center">
                    <Col span={24}>
                      <FullPageLoader fullscreen={false} />
                    </Col>
                  </Row>
                ) : null
              }
              scrollableTarget="PlayList"
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
                      onClick={() => navigate(PLAYLIST_ROUTES.ADD)}
                    />
                  ),
                }}
                renderItem={(item) => (
                  <List.Item key={item.id}>
                    <CardContent
                      {...item}
                      contentType={item.contentType as ModuleContentType}
                      allowMenu={false}
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

export default PlaylistDetail;
