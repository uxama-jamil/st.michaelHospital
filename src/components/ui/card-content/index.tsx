import { Card, Col, Dropdown, Menu, Row, Image, Skeleton } from 'antd';
import { FileUnknownOutlined, MoreOutlined } from '@ant-design/icons';
import { ModuleContentType } from '@/constants/module';
import type { CardContentProps } from '@/types/modules';
import styles from './style.module.scss';
import VideoIcon from '@assets/images/list-icons/play-btn.svg';
import AudioIcon from '@assets/images/list-icons/audio-btn.svg';
import DocumentIcon from '@assets/images/list-icons/Document-btn.svg';
import LinkIcon from '@assets/images/list-icons/Link-btn.svg';
import { Tag } from '@components/ui';
import { useState } from 'react';

export const PLACEHOLDER_IMG =
  'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200';

export const ICON_MAP: Record<string, JSX.Element> = {
  [ModuleContentType.Video]: <img src={VideoIcon} />,
  [ModuleContentType.Audio]: <img src={AudioIcon} />,
  [ModuleContentType.Document]: <img src={DocumentIcon} />,
  [ModuleContentType.Link]: <img src={LinkIcon} />,
};

export const getIcon = (type: string) => {
  const normalizedType = Object.values(ModuleContentType).find(
    (t) => t.toLowerCase() === type?.trim?.().toLowerCase(),
  );
  return ICON_MAP[normalizedType as ModuleContentType] || <FileUnknownOutlined />;
};
const CardContent = ({
  title,
  contentType,
  thumbnail,
  createdAt,
  onEdit,
  onDelete,
  duration,
}: CardContentProps & { duration?: string }) => {
  const [imgLoading, setImgLoading] = useState(true);

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={onEdit}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={onDelete}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
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
              <span className={styles.typeTag}>
                <Tag variant="warning">{contentType}</Tag>
              </span>
              {duration && <span className={styles.duration}>{duration}</span>}
            </div>
          </div>
        }
      >
        <div className={styles.contentHeader}>
          <Row align={'middle'} justify={'space-between'} gutter={16}>
            <Col>
              <h2 className={styles.title}>{title}</h2>
              <span className={styles.date}>
                Uploaded on{' '}
                {new Date(createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </Col>
            <Col>
              <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                <MoreOutlined className={styles.moreBtn} />
              </Dropdown>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
};

export default CardContent;
