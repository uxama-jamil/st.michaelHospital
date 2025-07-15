import { useEffect, useMemo, useRef, useState } from 'react';
import { useHeader } from '@/context/header';
import { Button, Card } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Space, Checkbox } from 'antd';
import AntInput from '@/components/ui/input';
import AntTextArea from '@/components/ui/text-area';
import AntDropdown from '@/components/ui/dropdown';
import FileUpload from '@/components/ui/file-uploader';
import { useFormik } from 'formik';
import { handleUploadFile, validate } from '@/utils';

import type { PlaylistContent, PlaylistForm, PlaylistResponse } from '@/types/playlist';
import { useMessage } from '@/context/message';
import keyword from '@/services/api';
import {
  CONTENT_DROP_DOWN_ORDER,
  CONTENT_DROP_DOWN_PAGE_SIZE,
  KEYWORDS_API,
} from '@/constants/api';
import FullPageLoader from '@/components/ui/spin';
import { ButtonType } from '@/constants/button';
import { PLAYLIST_ROUTES } from '@/constants/route';
import { ModuleContentStatus, ModuleContentType } from '@/constants/module';

import contentApi from '@/services/content-api';
import styles from './style.module.scss';
import playlistServices from '@/services/playlist-api';
import { sanitizeInput } from '@/utils/sanitize';
import type { ContentResponse, FileInfo } from '@/types/content';
import { addPlaylistRules } from '@/utils/rules';
import RenderContent from './render-content';

const AddPlayList = () => {
  const message = useMessage();
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState<string>('');
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [thumbnailDetails, setThumbnailDetails] = useState<{
    isEditMode: boolean;
    file: File;
    fileInfo: FileInfo;
  } | null>(null);
  const fetched = useRef({
    keywords: false,
    playlist: false,
  });
  const [playlistData, setPlaylistData] = useState<PlaylistResponse | null>(null);

  const [keywords, setKeywords] = useState([]);
  const [initialValues, setInitialValues] = useState<PlaylistForm>({
    name: '',
    keywordIds: [],
    description: '',
    thumbnail: '',
    content: [],
  });
  const [searchText, setSearchText] = useState('');
  const [selectedContent, setSelectedContent] = useState<PlaylistContent[]>([]);
  const { setTitle, setActions, setBreadcrumbs, setSubtitle } = useHeader();

  const fetchPlaylist = async () => {
    try {
      setIsLoading(true);
      const response = await playlistServices.getPlayListById(id);

      if (response) {
        // Normalize data for form fields
        setPlaylistData(response);
        setThumbnailDetails((prev) => ({
          ...prev,
          isEditMode: true,
        }));
      } else {
        message.error('Playlist data not found.');
      }
    } catch (err: any) {
      message.error(err?.message || 'Failed to fetch playlist');
    } finally {
      setIsLoading(false);
    }
  };
  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    return options.filter((opt) => opt.title?.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, options]);

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
    if (playlistData) {
      handlePlaylistData();
    }
  }, [playlistData, id]);

  const getKeywords = async () => {
    try {
      const response = await keyword.get(KEYWORDS_API);
      const data = response?.data?.data?.map((keyword: { [key: string]: any }) => {
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
    validate: (values) => validate(values, addPlaylistRules),
  });
  const handleSubmit = async (values: PlaylistForm) => {
    try {
      const payload = { ...values };
      payload['status'] = ModuleContentStatus.Draft;

      setIsLoading(true);
      if (thumbnailDetails?.file) {
        const key = await handleUploadFile(thumbnailDetails.file, thumbnailDetails.fileInfo);
        payload.thumbnail = key;
      }

      if (id) {
        payload['id'] = id;
        const response = await playlistServices.updatePlayList(id, payload);
        const data = response?.data;
        if (data) {
          message.success('Playlist updated successfully.');
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
          onClick={() => navigate(-1)}
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
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchContentData(true);
    }, 0);

    if (!fetched.current.keywords) {
      getKeywords();
      fetched.current.keywords = true;
    }

    if (id && !fetched.current.playlist) {
      fetchPlaylist();
      fetched.current.playlist = true;
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  const fetchContentData = async (reset = false) => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const pageToFetch = reset ? 1 : currentPage;
    try {
      const response = await contentApi.getAllContent(
        pageToFetch,
        CONTENT_DROP_DOWN_PAGE_SIZE,
        CONTENT_DROP_DOWN_ORDER,
      );
      const raw = response?.data;
      const data: ContentResponse[] = Array.isArray(raw.data) ? raw.data : [];
      const meta = raw.meta;

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
        setHasMore(meta?.hasNextPage);
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
    }
  };

  const renderSelected = () => {
    // Memoized map of options + selected data fallback
    const contentMap = useMemo(() => {
      const map = new Map();

      // Populate from options first
      options.forEach((item) => {
        map.set(item.id, item);
      });

      // Ensure selectedContent is also mapped, even if missing in options
      selectedContent.forEach((sc) => {
        if (!map.has(sc.contentId)) {
          // Try to find fallback from playlistData
          const fallback = playlistData?.content.find((c) => c.contentId === sc.contentId);
          if (fallback) {
            map.set(sc.contentId, {
              id: fallback.contentId,
              title: fallback.title,
              thumbnail: fallback.thumbnail,
              thumbnailAccessUrl: fallback.thumbnailAccessUrl,
              contentType: fallback.contentType || '',
            });
          }
        }
      });

      return map;
    }, [options, selectedContent, playlistData]);

    return (
      <div className={styles.selectedGrid}>
        {selectedContent.map((selectedItem) => {
          const item = contentMap.get(selectedItem.contentId);
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
  };

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
                        showSearch={false}
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
                        isEditMode={thumbnailDetails?.isEditMode}
                        name="thumbnail"
                        value={formik.values.thumbnail}
                        onChange={(value) => {
                          setThumbnailDetails((prev) => ({
                            ...prev,
                            isEditMode: false,
                          }));
                          formik.setFieldValue('thumbnail', value);
                        }}
                        fileDetails={(value) => {
                          setThumbnailDetails(value);
                        }}
                        onBlur={formik.handleBlur}
                        error={formik.touched.thumbnail && formik.errors.thumbnail}
                      />
                    </Col>
                    <Col span={24}>
                      <AntDropdown
                        label="Content"
                        mode="multiple"
                        searchValue={searchValue}
                        value={selectedContent.map((item) => item.contentId)}
                        onChange={(value) => {
                          const ids = Array.isArray(value) ? value.map(String) : [String(value)];
                          const updated = ids.map((id, index) => ({
                            contentId: id,
                            sortOrder: index + 1,
                          }));
                          setSelectedContent(updated);
                          formik.setFieldValue('content', updated);
                          setSearchText('');
                        }}
                        placeholder="Select"
                        required
                        onBlur={() => {
                          formik.setFieldTouched('content', true);
                          setSearchText('');
                        }}
                        loading={loadingMore}
                        error={
                          typeof formik.errors.content === 'string'
                            ? formik.touched.content && formik.errors.content
                            : undefined
                        }
                        showSearch
                        filterOption={false}
                        onSearch={(text) => {
                          const clean = sanitizeInput(text);
                          setSearchValue(clean);
                          setSearchText(clean);
                        }}
                        onPopupScroll={(e) => {
                          const target = e.target as HTMLDivElement;
                          if (
                            !loadingMore &&
                            hasMore &&
                            target.scrollTop + target.offsetHeight >= target.scrollHeight - 100
                          ) {
                            fetchContentData(); // loads more into `options`
                          }
                        }}
                        options={filteredOptions.map((item) => ({
                          label: item.title,
                          value: item.id,
                        }))}
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
