import { useEffect, useRef, useState } from 'react';
import { useHeader } from '@/context/header';
import { Button, Card } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Space, Checkbox, Skeleton } from 'antd';
import AntInput from '@/components/ui/input';
import AntTextArea from '@/components/ui/text-area';
import AntDropdown from '@/components/ui/dropdown';
import FileUpload from '@/components/ui/file-uploader';
import { useFormik } from 'formik';
import { validate } from '@/utils';

import type { PlaylistContent, PlaylistForm, PlaylistResponse } from '@/types/playlist';
import { useMessage } from '@/context/message';
import keyword from '@/services/api';
import { KEYWORDS_API } from '@/constants/api';
import FullPageLoader from '@/components/ui/spin';
import { ButtonType } from '@/constants/button';
import { PLAYLIST_ROUTES } from '@/constants/route';
import { ModuleContentType } from '@/constants/module';

import contentApi from '@/services/content-api';
import styles from './style.module.scss';
import { Image } from 'antd';
import { getIcon, PLACEHOLDER_IMG } from '@/components/ui/card-content';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [playlistData, setPlaylistData] = useState<PlaylistResponse | null>(null);
  const [dropdownFetching, setDropdownFetching] = useState(false);

  const [keywords, setKeywords] = useState([]);
  const [initialValues, setInitialValues] = useState<PlaylistForm>({
    name: '',
    keywordIds: [],
    description: '',
    thumbnail: '',
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

  const fetchPlaylist = async () => {
    try {
      setIsLoading(true);
      const response = await playlistServices.getPlayListById(id);

      if (response) {
        // Normalize data for form fields
        setPlaylistData(response);
      } else {
        message.error('Playlist data not found.');
      }
    } catch (err: any) {
      message.error(err?.message || 'Failed to fetch playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistData = () => {
    const selectedMapped =
      playlistData?.content.map((item: any) => ({
        id: item.contentId,
        title: item.title,
        thumbnail: item.thumbnail,
        thumbnailAccessUrl: item.thumbnailAccessUrl,
        contentType: item.contentType || '',
      })) || [];

    // Always ensure selectedMapped is merged into options directly
    setOptions((prev) => {
      const all = [...prev];
      selectedMapped.forEach((item) => {
        if (!all.some((opt) => opt.id === item.id)) {
          all.push(item);
        }
      });
      return all;
    });

    const selectedPlaylistContent =
      playlistData?.content.map((item: any) => ({
        contentId: item.contentId,
        sortOrder: item.sortOrder,
      })) || [];

    setSelectedContent(selectedPlaylistContent);

    setInitialValues({
      name: playlistData?.name || '',
      keywordIds: playlistData?.keywords.map((keyword: any) => keyword.id) || [],
      description: playlistData?.description || '',
      thumbnail: playlistData?.thumbnail || '',
      content: selectedPlaylistContent,
    });
  };

  // Fetch module data
  useEffect(() => {
    if (playlistData && !dropdownFetching) {
      handlePlaylistData();
    }
  }, [playlistData, id]);

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
      payload['status'] = 'draft';

      setIsLoading(true);

      if (id) {
        payload['id'] = id;
        const response = await playlistServices.updatePlayList(id, payload);
        const data = response?.data;
        if (data) {
          message.success(response?.message || 'Playlist updated successfully.');
          navigate(PLAYLIST_ROUTES.DETAIL.replace(':id', id));
        }
      } else {
        const response = await playlistServices.createPlaylist(payload);
        const data = response?.data;
        if (data) {
          message.success('Playlist created successfully.');
          navigate(PLAYLIST_ROUTES.DETAIL.replace(':id', data.id));
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
    setCurrentPage(1);
    fetchContentData(true);

    getKeywords();

    if (id) {
      fetchPlaylist();
    }
    // eslint-disable-next-line
  }, []);

  const fetchContentData = async (reset = false) => {
    if (loadingMore || !hasMore) return;
    setDropdownFetching(true);
    setLoadingMore(true);
    const pageToFetch = reset ? 1 : currentPage;
    try {
      const response = await contentApi.getAllContent(pageToFetch, 30, 'ASC');
      const data = response?.data?.data || [];
      const meta = response?.data?.meta || {};

      if (data.length > 0) {
        setOptions((prev) => {
          const newData = reset
            ? data
            : [
                ...data.filter((newItem) => !prev.some((existing) => existing.id === newItem.id)),
                ...options,
              ];
          return newData;
        });
        setHasMore(meta.hasNextPage);
        setCurrentPage(reset ? 2 : currentPage + 1);
      } else {
        if (reset) setOptions([]);
        setHasMore(false);
      }
    } catch (error) {
      message.showError(error, 'Failed to load content');
    } finally {
      setLoadingMore(false);
      setIsLoading(false);
      setDropdownFetching(false);
    }
  };

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
              thumbnail={item.thumbnailAccessUrl}
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
                        accessUrl={playlistData?.thumbnailAccessUrl || ''}
                        name="thumbnail"
                        value={formik.values.thumbnail}
                        onChange={(value) => {
                          formik.setFieldValue('thumbnail', value);
                        }}
                        onBlur={formik.handleBlur}
                        error={formik.touched.thumbnail && formik.errors.thumbnail}
                      />
                    </Col>
                    <Col span={24}>
                      <AntDropdown
                        label="Content"
                        mode="multiple"
                        value={selectedContent.map((item) => item.contentId)}
                        onChange={(value: string[]) => {
                          const updated = value.map((id, index) => ({
                            contentId: id,
                            sortOrder: index + 1,
                          }));

                          setSelectedContent(updated);
                          formik.setFieldValue('content', updated);
                        }}
                        placeholder="Select"
                        required
                        onBlur={() => formik.setFieldTouched('content', true)}
                        loading={loadingMore}
                        error={formik.touched.content && formik.errors.content}
                        options={options.map((item) => ({
                          label: item.title,
                          value: item.id,
                        }))}
                        onPopupScroll={(e) => {
                          const target = e.target as HTMLDivElement;
                          if (
                            !loadingMore &&
                            hasMore &&
                            target.scrollTop + target.offsetHeight >= target.scrollHeight - 100
                          ) {
                            fetchContentData(); // Only fetch when near bottom and not already loading
                          }
                        }}
                        filterOption={false}
                        style={{ width: '100%' }}
                      />

                      {renderSelected()}
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
