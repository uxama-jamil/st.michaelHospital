import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

type FullPageLoaderProps = {
  text?: string;
  fullscreen?: boolean;
};

function FullPageLoader(props: FullPageLoaderProps) {
  const { text = 'Please wait...', fullscreen = false } = props;
  const spinner = (
    <div
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <LoadingOutlined style={{ fontSize: 40 }} spin />
      <p
        style={{
          marginTop: 16,
          fontSize: 16,
        }}
      >
        {text}
      </p>
    </div>
  );
  return (
    <Spin
      tip={text}
      size="large"
      indicator={spinner}
      style={
        fullscreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }
          : undefined
      }
    />
  );
}

export default FullPageLoader;
