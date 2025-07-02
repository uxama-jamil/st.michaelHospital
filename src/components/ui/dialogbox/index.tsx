import { Modal } from 'antd';

const DialogBox = ({ visible, setVisible, children, ...rest }) => {
  return (
    <Modal open={visible} onCancel={() => setVisible(false)} centered {...rest}>
      {children}
    </Modal>
  );
};

export default DialogBox;
