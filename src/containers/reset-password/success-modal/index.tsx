import { Col, Modal, Row, Typography } from "antd";
import styles from "./style.module.scss";
import { Button } from "@/components/ui";
import { AUTH_ROUTES } from "@/constants/route";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-provider";

const { Text } = Typography;

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

function SuccessModal(props: SuccessModalProps) {
  const { open, onClose } = props;
  const { logOut } = useAuth();
  const navigate = useNavigate();
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      maskClosable={false}
      className={'modalBody'}
    >
      <Row
        justify="center"
        align="middle"
        gutter={[16, 30]}
        className='text-center'
      >
        <Col span={24}>
          <svg width="92" height="85" viewBox="0 0 92 85" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.3989 0.5L33.6854 9.79071C34.9795 15.0494 35.6266 17.6787 37.001 19.7991C38.2164 21.6742 39.8353 23.254 41.7395 24.4232C43.8929 25.7454 46.5373 26.328 51.826 27.4933L62.2246 29.7844L51.826 32.0755C46.5373 33.2408 43.8929 33.8234 41.7395 35.1456C39.8353 36.3148 38.2164 37.8946 37.001 39.7697C35.6266 41.8901 34.9795 44.5194 33.6854 49.7781L31.3989 59.0688L29.1125 49.7781C27.8183 44.5194 27.1713 41.8901 25.7968 39.7697C24.5815 37.8946 22.9625 36.3148 21.0584 35.1456C18.905 33.8234 16.2606 33.2408 10.9719 32.0755L0.573242 29.7844L10.9719 27.4933C16.2606 26.328 18.905 25.7454 21.0584 24.4232C22.9625 23.254 24.5815 21.6742 25.7968 19.7991C27.1713 17.6787 27.8183 15.0494 29.1125 9.7907L31.3989 0.5Z" fill="#563D81" />
            <path d="M71.7754 46.7388L71.9771 47.5677C73.2579 52.831 73.8982 55.4626 75.2675 57.5869C76.4784 59.4655 78.0937 61.0496 79.9954 62.2237C82.146 63.5515 84.7896 64.1405 90.0767 65.3187L91.4268 65.6195L90.0767 65.9203C84.7896 67.0985 82.146 67.6875 79.9954 69.0153C78.0937 70.1894 76.4784 71.7736 75.2675 73.6521C73.8982 75.7764 73.2579 78.408 71.9771 83.6713L71.7754 84.5002L71.5737 83.6713C70.2929 78.408 69.6526 75.7764 68.2833 73.6521C67.0724 71.7736 65.4571 70.1894 63.5554 69.0153C61.4048 67.6875 58.7612 67.0985 53.4741 65.9203L52.124 65.6195L53.4741 65.3187C58.7612 64.1405 61.4048 63.5515 63.5554 62.2237C65.4571 61.0496 67.0724 59.4655 68.2833 57.5869C69.6526 55.4626 70.2929 52.831 71.5737 47.5677L71.7754 46.7388Z" fill="#563D81" />
          </svg>

        </Col>
        <Col span={24}>
          <h2 className={styles.title} >
            Password changed
          </h2>
          <Text className={styles.subTitle}>
            Your password has been changed successfully
          </Text>
        </Col>
        <Col span={24}>
          <Button
            key="save"
            onClick={() => {
              logOut();
              navigate(AUTH_ROUTES.LOGIN);
            }}
            htmlType="submit"
            text="Back to login"
            size="small"
            type="primary"
          />
        </Col>
      </Row>
    </Modal >
  );
}

export default SuccessModal;
