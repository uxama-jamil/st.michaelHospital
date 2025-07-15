import { Tag } from '@/components/ui';
import { useEffect, useRef, useState } from 'react';
import { Space, Tooltip } from 'antd';

type Props = {
  keywords: string[];
  maxTagWidth?: number;
};

const DynamicTagGroup = ({ keywords, maxTagWidth = 120 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(keywords.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.offsetWidth;
    let usedWidth = 0;
    let count = 0;

    for (let i = 0; i < keywords.length; i++) {
      usedWidth += maxTagWidth + 8; // Approximate width of each tag
      if (usedWidth > totalWidth) break;
      count++;
    }
    setVisibleCount(count);
  }, [keywords]);

  const visible = keywords.slice(0, visibleCount);
  const hidden = keywords.slice(visibleCount);
  const hiddenCount = hidden.length;
  console.log('hidden', hidden);
  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <Space size={[4, 4]} wrap>
        {visible.map((k, i) => (
          <Tag key={i} variant="secondary">
            {k}
          </Tag>
        ))}

        {hiddenCount > 0 && (
          <Tooltip
            placement="top"
            title={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {hidden.map((k, i) => (
                  <div key={i} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {k}
                  </div>
                ))}
              </div>
            }
          >
            <span>
              <Tag variant="secondary">{`+${hiddenCount}`}</Tag>
            </span>
          </Tooltip>
        )}
      </Space>
    </div>
  );
};

export default DynamicTagGroup;
