import { Button, Table, Tag, Empty } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useHeader } from '@/context/header';
import { USER_ROUTES } from '@/constants/route';
import { DeleteOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Space } from 'antd';
import userManagementServices from '@/services/user-management-api';
import type { UserDetails } from '@/types/user-management';
import type { TablePaginationConfig } from 'antd/es/table';
import { createEmailLink, formatPhoneNumber } from '@/utils';
import { useMessage } from '@/context/message';
import { useCallback } from 'react';
import ResendModal from './resend-modal';
import FullPageLoader from '@/components/ui/spin';
import { useAuth } from '@/context/auth-provider';
import { USER_MANAGEMENT_ORDER, USER_MANAGEMENT_PAGE_SIZE } from '@/constants/api';

const UserManagement = () => {
  const { setTitle, setSubtitle, setActions, setBreadcrumbs } = useHeader();
  const navigate = useNavigate();
  const [resendModalOpen, setResendModalOpen] = useState(false);
  const [resendEmail, setResendEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const message = useMessage();
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: USER_MANAGEMENT_PAGE_SIZE,
    total: 0,
  });
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; user?: UserDetails }>({
    open: false,
  });
  const { user: userDetails } = useAuth();

  useEffect(() => {
    setTitle('User Management');
    setSubtitle(`Total: ${pagination.total}`);
    setActions([
      <Button
        key="add"
        text="Add New User"
        size="small"
        className="small"
        onClick={() => navigate(USER_ROUTES.ADD)}
      />,
    ]);
    setBreadcrumbs([]);
  }, [pagination.total]);

  const fetchUsers = async (page: number, pageSize: number) => {
    try {
      setLoading(true);
      const { data, meta } = await userManagementServices.getAllUsers(
        page,
        pageSize,
        USER_MANAGEMENT_ORDER,
      );
      setUsers(data);
      setPagination((prev) => ({
        ...prev,
        current: meta.page,
        total: meta.itemCount,
        pageSize: meta.take,
      }));
    } catch (error) {
      message.showError(error, 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(pagination.current!, pagination.pageSize!);
    // eslint-disable-next-line
  }, [pagination.current, pagination.pageSize]);

  const handleEditOrView = useCallback(
    (id: string, isViewOnly: boolean) => {
      navigate(USER_ROUTES.EDIT.replace(':id', encodeURIComponent(id)), {
        state: { isViewOnly },
      });
    },
    [navigate],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setConfirmModal({ open: false });
        setResendLoader(true);
        await userManagementServices.deleteUser(id);
        message.success('User deleted successfully.');
        fetchUsers(pagination.current!, pagination.pageSize!);
      } catch (error) {
        setResendLoader(false);
        message.showError(error, 'Failed to delete user.');
      }
    },
    [message, pagination.current, pagination.pageSize],
  );

  const handleResendEmail = useCallback(
    async (email: string) => {
      try {
        setResendLoader(true);
        await userManagementServices.resendEmail(email);
        message.success('Email resent successfully.');
        setResendEmail(email);
        setResendModalOpen(true);
        fetchUsers(pagination.current!, pagination.pageSize!);
        setResendLoader(false);
      } catch (error) {
        message.showError(error, 'Failed to send email.');
      } finally {
        setResendLoader(false);
      }
    },
    [message, pagination.current, pagination.pageSize, users],
  );
  const currentUserId = (() => {
    try {
      return userDetails?.id;
    } catch {}
    return null;
  })();
  const columns = useMemo(
    () => [
      {
        title: 'Full Name',
        dataIndex: 'name',
        key: 'name',
        width: '220PX',
        render: (name: string | null | undefined) => (name ? name : 'N/A'),
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        key: 'designation',
        width: '200PX',
        render: (designation: string | null | undefined) => (designation ? designation : 'N/A'),
      },
      {
        title: 'Email Address',
        dataIndex: 'email',
        key: 'email',
        width: '250PX',
        render: (email: string) => (email ? createEmailLink(email) : 'N/A'),
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone',
        key: 'phone',
        width: '200PX',
        render: (phone: string | null) => (phone ? formatPhoneNumber(phone) : 'N/A'),
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        width: '220PX',
        render: (isActive: boolean, record: any) => (
          <Space>
            <Tag variant={isActive ? 'success' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Tag>
            {record.resend && (
              <Tag variant="primary" onClick={() => handleResendEmail(record.email)}>
                Resend
              </Tag>
            )}
          </Space>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: '120px',
        render: (_: any, record: UserDetails) => (
          <Space size="middle">
            <EditOutlined onClick={() => handleEditOrView(record.id, false)} />
            {!record.defaultAdmin && record.id !== currentUserId && (
              <DeleteOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmModal({ open: true, user: record });
                }}
              />
            )}
            <RightOutlined onClick={() => handleEditOrView(record.id, true)} />
          </Space>
        ),
      },
    ],
    [handleEditOrView, handleDelete, handleResendEmail],
  );

  return (
    <>
      {resendLoader && <FullPageLoader fullscreen={true} />}
      <Row gutter={[16, 16]} justify="end">
        <Col span={24}>
          <Table
            columns={columns}
            data={users}
            rowKey="id"
            loading={loading}
            showPagination={true}
            total={pagination.total}
            currentPage={pagination.current}
            pageSize={pagination.pageSize} // <-- Add this line!
            onPageChange={(page) => {
              setPagination((prev) => ({ ...prev, current: page }));
            }}
            locale={{
              emptyText: (
                <Empty
                  heading="No users added yet"
                  message="Start adding users by adding your first one."
                  buttonText="Add New User"
                  onClick={() => {
                    navigate(USER_ROUTES.ADD);
                  }}
                />
              ),
            }}
          />
        </Col>
      </Row>
      <Modal
        open={confirmModal.open}
        title="Confirm"
        footer={[
          <Button key="cancel" type="default" onClick={() => setConfirmModal({ open: false })}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            onClick={async () => {
              if (confirmModal.user) {
                await handleDelete(confirmModal.user.id);
              }
              setConfirmModal({ open: false });
            }}
          >
            Delete User
          </Button>,
        ]}
        onCancel={() => setConfirmModal({ open: false })}
      >
        {`Are you sure you want to delete user ${confirmModal.user?.name}?`}
      </Modal>
      <ResendModal
        open={resendModalOpen}
        onClose={() => setResendModalOpen(false)}
        email={resendEmail || ''}
      />
    </>
  );
};

export default UserManagement;
