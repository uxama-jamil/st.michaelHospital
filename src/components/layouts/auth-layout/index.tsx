import styles from "./style.module.scss";
import Logo from "@assets/images/auth/auto-logo.webp";
import PoweredByLogo from "@assets/images/auth/powered-by.webp";
import { Col, Row } from "antd";

const AuthLayout = ({ children }) => {
  return (
    <div className="container-fluid no-padd">
      <Row className={styles.bgPrimary}>
        <Col xs={0} sm={0} md={10} >
          <section className={styles.leftSection} >
            <div className={styles.leftSectionContent}>
              <img src={Logo} alt="MyEndo" className={styles.logo} />
            </div>
            <img src={PoweredByLogo} alt="Powered by St.Micheal's Unity Health Toronto " />
          </section>
        </Col>
        <Col xs={24} sm={24} md={14} className={styles.rightSection}>
          <section className={styles.loginBox}>
            {children}
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default AuthLayout;
