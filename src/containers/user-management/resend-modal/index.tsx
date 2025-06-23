
import { CheckCircleFilled } from "@ant-design/icons";
import { Col, Divider, Modal, Row, Typography } from "antd";
import styles from "./style.module.scss";
import { createEmailLink } from "@/utils";
import { Button } from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { USER_ROUTES } from "@/constants/route";

const { Text } = Typography;

interface ResendModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

function ResendModal(props: ResendModalProps) {
  const { open, onClose, email } = props;
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
        gutter={[16, 20]}
        className='text-center'
      >
        <Col span={24}>
          <CheckCircleFilled className={styles.icon} />
        </Col>
        <Col span={24}>
          <h2 className={styles.title} >
            Password link sent
          </h2>
          <Text className={styles.subTitle}>
            Please check your inbox <b>{email ? createEmailLink(email) : 'N/A'}</b>
          </Text>
        </Col>
        <Col span={24}>
          <Divider className="no-mgr" />
        </Col>
        <Col span={24}>

          <Text>
            <span className={styles.subTitle}>
              Unsure if that email address was correct?
            </span>
            <span className={styles.boldText}>
              &nbsp;We can help.
            </span>
          </Text>
        </Col>
        <Col span={24}>
          <Button
            key="Back to Main"
            onClick={() => {
              navigate(USER_ROUTES.BASE);
            }}
            htmlType="button"
            text="Back to Main"
            size="small"
            type="primary"
          />
        </Col>
      </Row>
    </Modal >
  );
}

export default ResendModal;
