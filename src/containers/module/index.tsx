import { Button, Tag, DialogBox } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHeader } from '@/context/header';
import { DeleteOutlined, EditOutlined, RightOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tooltip } from 'antd';
import { Empty } from '@/components/ui';
import Table from '@/components/ui/table';
import { MODULES_ROUTES } from '@/constants/route';

import api from '@/services/modules-management';
import type { Module, RawModule } from '@/types/modules';
import { MODULES_ORDER, MODULES_PAGE_SIZE } from '@/constants/api';
import { useMessage } from '@/context/message';
import { useModule } from '@/context/module';
import { ButtonType } from '@/constants/button';
import FullPageLoader from '@/components/ui/spin';
import DynamicTagGroup from '@/components/ui/dynamic-tag-group';

const Modules = () => {
  const message = useMessage();
  const { setModule } = useModule();
  const [modules, setModules] = useState<Module[]>([]);
  const [deleteModule, setDeleteModule] = useState<{ name: string; modal: boolean; id: string }>({
    name: '',
    modal: false,
    id: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setTitle, setSubtitle, setActions, setBreadcrumbs } = useHeader();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const fetchModules = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await api.getModules(page, MODULES_PAGE_SIZE, MODULES_ORDER);

      if (response) {
        const rawData: RawModule[] = response?.data?.data || [];

        const formattedData: Module[] = rawData.map((item) => ({
          ...item,
          createdBy: item.createdBy?.userName ?? 'N/A',
          keywords: item.keywords.map((k) => k.name),
        }));
        setModules(formattedData);
        setTotal(response?.data?.meta?.itemCount || 0);
      }
    } catch (error) {
      message.showError(error, 'Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchModules(page);
    }, 0);

    return () => clearTimeout(timer);
  }, [page]);

  useEffect(() => {
    setTitle('Module Management');
    setSubtitle(`Total: ${total}`);
    setActions([
      <Button
        key="add"
        text="Add New Module"
        size="small"
        type={ButtonType.PRIMARY}
        onClick={() => navigate(MODULES_ROUTES.ADD)}
      />,
    ]);
    setBreadcrumbs([]);
  }, [total]);

  const columns = useMemo(
    () => [
      {
        title: 'Module Name',
        dataIndex: 'title',
        key: 'title',
        width: '250px',
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '180px',
      },
      {
        title: 'Resources',
        dataIndex: 'contentCount',
        key: 'contentCount',
        width: '100px',
      },
      {
        title: 'Keywords',
        dataIndex: 'keywords',
        width: '250px',
        key: 'keywords',
        render: (keywords: string[]) =>
          keywords.length > 0 ? <DynamicTagGroup keywords={keywords} /> : 'N/A',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '100px',
        render: (status: string) => (
          <Space size={'small'}>
            <Tag variant={status === 'Draft' ? 'warning' : 'success'}>
              {status.toLowerCase() === 'draft' ? 'Draft' : 'Published'}
            </Tag>
          </Space>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: '120px',
        render: (record: any) => {
          const status = record.status.toLowerCase();
          return (
            <Space size="middle">
              <EditOutlined
                onClick={() => status !== 'published' && handleEdit(record.id)}
                className={status === 'published' ? 'action-disabled' : ''}
                title={status === 'published' ? 'Cannot edit published module' : 'Edit'}
              />
              <DeleteOutlined
                onClick={() =>
                  status !== 'published' &&
                  setDeleteModule({ name: record.title, modal: true, id: record.id })
                }
                className={status === 'published' ? 'action-disabled' : ''}
                title={status === 'published' ? 'Cannot delete published module' : 'Delete'}
              />
              <RightOutlined
                key="view"
                onClick={() => {
                  setModule(record);
                  navigate(
                    MODULES_ROUTES.CONTENT.BASE.replace(':id', encodeURIComponent(record.id)),
                  );
                }}
              />
            </Space>
          );
        },
      },
    ],
    [],
  );
  const handleEdit = (id: string) => {
    navigate(MODULES_ROUTES.EDIT.replace(':id', encodeURIComponent(id)));
  };
  const handleDelete = async (id: string) => {
    try {
      setDeleteModule({ name: '', modal: false, id: '' });
      setIsLoading(true);

      const response = await api.deleteModule(id);
      if (response) {
        message.success('Module deleted successfully.');

        fetchModules(page);
      }
    } catch (error) {
      message.showError(error, 'Failed to delete module.');
    } finally {
      setDeleteModule({ name: '', modal: false, id: '' });
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <FullPageLoader fullscreen={true} />}
      <Row gutter={[16, 16]} justify={'end'}>
        <Col span={24}>
          <Table
            columns={columns}
            data={modules}
            rowKey="id"
            showPagination={true}
            total={total}
            currentPage={page}
            pageSize={MODULES_PAGE_SIZE}
            onPageChange={(p) => setPage(p)}
            loading={loading}
            locale={{
              emptyText: (
                <Empty
                  heading="No modules added yet"
                  message="Start managing your modules by adding your first one."
                  buttonText="Add New Module"
                  onClick={() => {
                    navigate(MODULES_ROUTES.ADD);
                  }}
                />
              ),
            }}
          />
        </Col>
      </Row>

      <DialogBox
        visible={deleteModule.modal}
        setVisible={setDeleteModule}
        footer={[
          <Button
            key="cancel"
            type={ButtonType.DEFAULT}
            onClick={() => setDeleteModule({ name: '', modal: false, id: '' })}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type={ButtonType.PRIMARY}
            onClick={() => handleDelete(deleteModule.id)}
          >
            Delete
          </Button>,
        ]}
      >
        <div>
          <h1>
            Delete <strong>{deleteModule.name}</strong>?
          </h1>
          <p>Are you sure you want to delete this module?</p>
        </div>
      </DialogBox>
    </>
  );
};

export default Modules;
