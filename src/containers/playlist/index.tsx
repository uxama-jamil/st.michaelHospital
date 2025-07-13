import { Button, Table, Tag, Empty, DialogBox as AntModal } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useHeader } from '@/context/header';
import { PLAYLIST_ROUTES } from '@/constants/route';
import { DeleteOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Row, Space } from 'antd';
import playListServices from '@/services/playlist-api';
import type { Playlist } from '@/types/playlist';
import type { TablePaginationConfig } from 'antd/es/table';
import { useMessage } from '@/context/message';
import { DynamicTagGroup } from '../module';
import { PLAYLIST_ORDER, PLAYLIST_PAGE_SIZE } from '@/constants/api';
import FullPageLoader from '@/components/ui/spin';
import { ModuleContentStatus } from '@/constants/module';

const PlayList = () => {
  const { setTitle, setSubtitle, setActions, setBreadcrumbs } = useHeader();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const message = useMessage();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: PLAYLIST_PAGE_SIZE,
    total: 0,
  });
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; playlist?: Playlist }>({
    open: false,
  });

  useEffect(() => {
    setTitle('Playlist');
    setSubtitle(`Total: ${pagination.total}`);
    setActions([
      <Button
        key="Add New Playlist"
        text="Add New Playlist"
        size="small"
        className="small"
        onClick={() => navigate(PLAYLIST_ROUTES.ADD)}
      />,
    ]);
    setBreadcrumbs([]);
  }, [pagination.total]);

  const fetchPlayList = useCallback(
    async (page: number, pageSize: number) => {
      try {
        setLoading(true);
        const { data, meta } = await playListServices.getPlaylist(page, pageSize, PLAYLIST_ORDER);
        setPlaylists(data);
        setPagination((prev) => ({
          ...prev,
          current: meta?.page ?? 1,
          total: meta?.itemCount ?? 0,
          pageSize: meta?.take ?? pageSize,
        }));
      } catch (error) {
        message.showError(error, 'Failed to fetch playlists');
      } finally {
        setLoading(false);
      }
    },
    [message],
  );

  useEffect(() => {
    fetchPlayList(pagination.current!, pagination.pageSize!);
  }, [fetchPlayList, pagination.current, pagination.pageSize]);

  const handleEditOrView = useCallback(
    (id: string, isViewOnly: boolean) => {
      navigate(PLAYLIST_ROUTES.EDIT.replace(':id', encodeURIComponent(id)), {
        state: { isViewOnly },
      });
    },
    [navigate],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setConfirmModal({ open: false });
        setLoading(true);
        await playListServices.deletePlayList(id);
        message.success('Playlist deleted successfully.');
        fetchPlayList(pagination.current!, pagination.pageSize!);
      } catch (error) {
        message.showError(error, 'Failed to delete playlist.');
      } finally {
        setLoading(false);
      }
    },
    [message, fetchPlayList, pagination.current, pagination.pageSize],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Playlist Name',
        dataIndex: 'name',
        key: 'name',
        render: (name: string) => name ?? 'N/A',
      },
      {
        title: 'Created by',
        key: 'createdBy',
        dataIndex: 'createdBy',
        render: (_: any, record: Playlist) => record.createdBy?.userName ?? 'N/A',
      },
      {
        title: 'Total Resources',
        key: 'totalResources',
        dataIndex: 'content',
        render: (_: any, record: Playlist) =>
          record.content?.length?.toString().padStart(2, '0') ?? '00',
      },
      {
        title: 'Keyword',
        key: 'keywords',
        dataIndex: 'keywords',
        width: 280,
        render: (keywords: any[]) =>
          keywords.length > 0 ? <DynamicTagGroup keywords={keywords.map((k) => k?.name)} /> : 'N/A',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          return (
            <Tag
              variant={
                status.toLowerCase() === ModuleContentStatus.Draft.toLowerCase()
                  ? 'warning'
                  : 'success'
              }
            >
              {status.toLowerCase() === ModuleContentStatus.Draft.toLowerCase()
                ? ModuleContentStatus.Draft
                : ModuleContentStatus.Published}
            </Tag>
          );
        },
      },
      {
        title: 'Action',
        key: 'action',
        width: '120px',
        render: (_: any, record: Playlist) => {
          const status = record.status.toLowerCase();

          return (
            <Space size="middle">
              <EditOutlined
                onClick={() => status !== 'published' && handleEditOrView(record.id, false)}
                className={status === 'published' ? 'action-disabled' : ''}
                title={status === 'published' ? 'Cannot edit published playlist' : 'Edit'}
              />
              <DeleteOutlined
                onClick={() =>
                  status !== 'published' && setConfirmModal({ open: true, playlist: record })
                }
                className={status === 'published' ? 'action-disabled' : ''}
                title={status === 'published' ? 'Cannot delete published playlist' : 'Delete'}
              />
              <RightOutlined
                onClick={() =>
                  navigate(PLAYLIST_ROUTES.DETAIL.replace(':id', encodeURIComponent(record.id)))
                }
              />
            </Space>
          );
        },
      },
    ],
    [handleEditOrView],
  );

  return (
    <>
      {loading && <FullPageLoader fullscreen={true} />}
      <Row gutter={[16, 16]} justify="end">
        <Col span={24}>
          <Table
            columns={columns}
            data={playlists}
            rowKey="id"
            loading={loading}
            showPagination={true}
            total={pagination.total}
            currentPage={pagination.current}
            pageSize={pagination.pageSize}
            onPageChange={(page) => {
              setPagination((prev) => ({ ...prev, current: page }));
            }}
            locale={{
              emptyText: (
                <Empty
                  heading="No playlists added yet"
                  message="Start adding playlists by adding your first one."
                  buttonText="Add New Playlist"
                  onClick={() => {
                    navigate(PLAYLIST_ROUTES.ADD);
                  }}
                />
              ),
            }}
          />
        </Col>
      </Row>
      <AntModal
        visible={confirmModal.open}
        setVisible={(open) => setConfirmModal({ open })}
        title="Confirm"
        footer={[
          <Button key="cancel" type="default" onClick={() => setConfirmModal({ open: false })}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            onClick={async () => {
              if (confirmModal.playlist) {
                await handleDelete(confirmModal.playlist.id);
              }
              setConfirmModal({ open: false });
            }}
          >
            Delete Playlist
          </Button>,
        ]}
        onCancel={() => setConfirmModal({ open: false })}
      >
        {`Are you sure you want to delete playlist ${confirmModal.playlist?.name}?`}
      </AntModal>
    </>
  );
};

export default PlayList;
