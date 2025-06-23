import { useEffect, useState } from 'react';
import { useHeader } from '@/context/header';
import { Button, Card } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Space, type SelectProps, Checkbox, Skeleton, Tag } from 'antd';
import AntInput from '@/components/ui/input';
import AntTextArea from '@/components/ui/text-area';
import AntDropdown from '@/components/ui/dropdown';
import FileUpload from '@/components/ui/file-uploader';
import { useFormik } from 'formik';
import { validate } from '@/utils';

import type { PlaylistContent, PlaylistForm, PlaylistPayload } from '@/types/playlist';
import { useMessage } from '@/context/message';
import keyword from '@/services/api';
import { KEYWORDS_API } from '@/constants/api';
import FullPageLoader from '@/components/ui/spin';
import { useModule } from '@/context/module';
import { mockImages } from '@/constants/image-links';
import { ButtonType } from '@/constants/button';
import { PLAYLIST_ROUTES } from '@/constants/route';
import { ModuleContentType } from '@/constants/module';
import modulesManagementServices from '@/services/modules-management';
import styles from './style.module.scss';
import { Image } from 'antd';
import { getIcon, PLACEHOLDER_IMG, ICON_MAP } from '@/components/ui/card-content';
import playlistServices from '@/services/playlist-api';

const RenderContent = ({ contentType, title, thumbnail }) => {
  const [imgLoading, setImgLoading] = useState(true);
  return (
    <Card
      hoverable={true}
      variant={'borderless'}
      className={`${styles.cardContent} content-card`}
      cover={
        <div className={styles.cover}>
          <Skeleton.Image
            style={{
              display: imgLoading ? 'block' : 'none',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
            active
          />
          <Image
            alt={title}
            src={thumbnail}
            fallback={PLACEHOLDER_IMG}
            className={styles.image}
            preview={false}
            onLoad={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            style={{
              display: imgLoading ? 'none' : 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
          <div className={styles.overlay}>
            <span className={styles.playIcon}>{getIcon(contentType)}</span>
          </div>
        </div>
      }
    ></Card>
  );
};
const AddPlayList = () => {
  const message = useMessage();
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const { id } = useParams<{ id: string }>();
  const { setModule } = useModule();
  const [keywords, setKeywords] = useState([]);
  const [initialValues, setInitialValues] = useState<PlaylistForm>({
    name: '',
    keywordIds: [],
    description: '',
    thumbnail: mockImages[Math.floor(Math.random() * mockImages.length)],
    content: [],
  });
  const [selectedContent, setSelectedContent] = useState<PlaylistContent[]>([]);
  const { setTitle, setActions, setBreadcrumbs, setSubtitle } = useHeader();
  const rules = {
    name: {
      required: { value: true, message: 'Playlist name is required.' },
      min: { value: 3, message: 'Playlist name must be between 3 and 50 characters.' },
      max: { value: 50, message: 'Playlist name must be between 3 and 50 characters.' },
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
      required: { value: true, message: 'Thumbnail is required.' },
    },
    content: {
      required: { value: true, message: 'Content is required.' },
    },
  };

  // Fetch module data
  useEffect(() => {
    getKeywords();
    // const fetchModule = async () => {
    //   try {
    //     const response = await api.getModule(id);
    //     const data = response?.data;
    //     if (data) {
    //       // Normalize data for form fields
    //       const normalized = {
    //         title: data.title || '',
    //         keywordIds: data.keywords.map((keyword: any) => keyword.id) || [],
    //         description: data.description || '',
    //         thumbnail: data.thumbnail || '',
    //       };
    //       setInitialValues(normalized);
    //     } else {
    //       message.error('Playlist data not found.');
    //     }
    //   } catch (err: any) {
    //     message.error(err?.message || 'Failed to fetch playlist');
    //   }
    // };
    // if (id) {
    //   fetchModule();
    // }
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
  const handleSubmit = async (values: PlaylistForm) => {
    try {
      const payload = { ...values };
      console.log('payload', payload);
      setIsLoading(true);

      if (id) {
        // payload['id'] = id;
        // const response = await api.updatePlaylist(payload);
        // const data = response?.data;
        // if (data) {
        //   message.success(response?.message || 'Playlist updated successfully.');
        //   setPlaylist(data as Partial<Playlist>);
        //   navigate(PLAYLIST_ROUTES.BASE);
        // }
      } else {
        const response = await playlistServices.createPlaylist(payload);
        const data = response?.data;
        if (data) {
          message.success('Playlist created successfully.');
          // setPlaylist(data as Partial<Playlist>);
          navigate(PLAYLIST_ROUTES.BASE);
        }
      }
    } catch (err: any) {
      message.error('Failed to save playlist.');
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    setTitle(`${id ? 'Edit' : 'Add'} Playlist`);
    setSubtitle('');
    setActions([
      <Space size={'small'}>
        <Button
          key="cancel"
          text="Cancel"
          size="small"
          type={ButtonType.DEFAULT}
          onClick={() => navigate(PLAYLIST_ROUTES.BASE)}
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
        label: 'Playlists Management',
        onClick: () => navigate(PLAYLIST_ROUTES.BASE),
      },
      {
        label: `${id ? 'Edit' : 'Add New'} Playlist`,
        onClick: () => {},
        active: true,
      },
    ]);
  }, []);

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    const payload = {
      order: 'ASC',
      page: 1,
      take: 18,
      categoryId: '45ba9ac2-e698-4909-8036-8e2632e31424',
    };
    const response = await modulesManagementServices.getModuleContents(payload);
    const data = response?.data?.data || [];
    setOptions(data);
    setIsLoading(false);
  };

  const dropdownRender: SelectProps['dropdownRender'] = (menu) => (
    <div className={styles.playlistDropdown}>
      <div className={styles.playlistGrid}>
        {options.map((item) => {
          // const isSelected = selectedIds.includes(item.id);
          const isSelected = selectedContent.some((c) => c.contentId === item.id);
          return (
            <div
              key={item.id}
              className={`${styles.playlistCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => {
                if (isSelected) {
                  const updated = selectedContent.filter((c) => c.contentId !== item.id);
                  setSelectedContent(updated);
                  formik.setFieldValue('content', updated);
                } else {
                  const updated = [
                    ...selectedContent,
                    {
                      contentId: item.id,
                      sortOrder: selectedContent.length + 1,
                    },
                  ];
                  setSelectedContent(updated);
                  formik.setFieldValue('content', updated);
                }
              }}
            >
              <Checkbox className={styles.checkbox} checked={isSelected} />
              <RenderContent
                contentType={item.contentType}
                title={item.title}
                thumbnail={item.thumbnail}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSelected = () => (
    <div className={styles.selectedGrid}>
      {selectedContent.map((selectedItem) => {
        const item = options.find((opt) => opt.id === selectedItem.contentId);
        if (!item) return null;

        return (
          <div
            key={item.id}
            className={styles.playlistCard}
            onClick={() => {
              const updated = selectedContent.filter((c) => c.contentId !== item.id);
              setSelectedContent(updated);
              formik.setFieldValue('content', updated);
            }}
          >
            <Checkbox className={styles.checkbox} checked />
            <RenderContent
              contentType={item.contentType}
              title={item.title}
              thumbnail={item.thumbnail}
            />
          </div>
        );
      })}
    </div>
  );
  return (
    <>
      {isLoading && <FullPageLoader fullscreen={true} />}
      <Row>
        <Col sm={{ span: 24 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
          <Card title="Playlist detail">
            <Row>
              <Col sm={{ span: 24 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
                <form onSubmit={formik.handleSubmit}>
                  <Row gutter={[24, 12]}>
                    <Col span={12}>
                      <AntInput
                        label="Playlist name"
                        required
                        placeholder="Enter playlist name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name}
                      />
                    </Col>
                    <Col span={12}>
                      <AntDropdown
                        label="Link Keywords"
                        required
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
                        type={ModuleContentType.Image}
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
                    <Col span={24}>
                      <div>
                        <label>Content *</label>
                        <AntDropdown
                          mode="multiple"
                          value={selectedContent.map((item) => item.contentId)}
                          onChange={(value: string[]) => {
                            const updated = value.map((id, index) => ({
                              contentId: id,
                              sortOrder: index + 1,
                            }));
                            console.log('valuess', value);
                            setSelectedContent(updated);
                            formik.setFieldValue('content', updated);
                          }}
                          placeholder="Select"
                          required
                          onBlur={() => formik.setFieldTouched('content', true)}
                          loading={isLoading}
                          error={formik.touched.content && formik.errors.content}
                          dropdownRender={dropdownRender}
                          filterOption={false}
                          style={{ width: '100%' }}
                        />

                        {renderSelected()}
                      </div>
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

export default AddPlayList;
