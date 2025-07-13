import { useState } from 'react';
import { Card } from '@/components/ui';
import { Skeleton } from 'antd';

import styles from '../style.module.scss';
import { Image } from 'antd';
import { getIcon, PLACEHOLDER_IMG } from '@/components/ui/card-content';

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

export default RenderContent;
