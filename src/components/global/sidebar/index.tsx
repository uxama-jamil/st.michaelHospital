// Sider.tsx
import { Layout, Menu, Button, Row, Col, Divider, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';
import Logo from '@/assets/images/dashboard/Logo.svg';

import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { MODULES_ROUTES, USER_ROUTES, PLAYLIST_ROUTES, ROUTE_PATHS } from '@/constants/route';
import { useAuth } from '@/context/auth-provider';
import { truncateText } from '@/utils';

import ModulesManagementIcon from '@/assets/images/dashboard/sidebar/module-managmenet.svg?react';
import UserManagementIcon from '@/assets/images/dashboard/sidebar/user-management.svg?react';
import PlayListIcon from '@/assets/images/dashboard/sidebar/playlist.svg?react';
import ResetPasswordIcon from '@/assets/images/dashboard/sidebar/reset-password.svg?react';

const { Sider } = Layout;

const menuItems = [
  {
    key: 'modules',
    icon: <ModulesManagementIcon />,
    label: 'Modules Mgmt.',
    route: MODULES_ROUTES.BASE,
  },
  {
    key: 'users',
    icon: <UserManagementIcon />,
    label: 'User Mgmt.',
    route: USER_ROUTES.BASE,
  },
  {
    key: 'playlist',
    icon: <PlayListIcon />,
    label: 'Playlist',
    route: PLAYLIST_ROUTES.BASE,
  },
];

const AppSider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut, user } = useAuth();

  const [userName, setUserName] = useState('N/A');
  const [userEmail, setUserEmail] = useState('N/A');

  useEffect(() => {
    try {
      if (user) {
        setUserName(user?.name || 'N/A');
        setUserEmail(user?.email || 'N/A');
      }
    } catch {
      setUserName('N/A');
      setUserEmail('N/A');
    }
  }, [user]);

  const selectedKey = useMemo(() => {
    if (location.pathname === ROUTE_PATHS.RESET_PASSWORD) return '';
    if (location.pathname === ROUTE_PATHS.PROFILE) return '';
    if (location.pathname.startsWith(USER_ROUTES.BASE)) return 'users';
    if (
      location.pathname.startsWith(PLAYLIST_ROUTES.BASE) ||
      location.pathname.includes('playlist')
    )
      return 'playlist';
    return 'modules';
  }, [location.pathname]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuItems.find((i) => i.key === key);
    if (item?.route) {
      navigate(item.route);
    }
  };
  return (
    <Sider className={styles.appSider} width={250}>
      <Row gutter={[0, 16]} justify={'space-between'} className={styles.height}>
        <Col>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Link to="/">
                <img src={Logo} alt="My Endo" className="logo" />
              </Link>
            </Col>
            <Col span={24}>
              <Menu
                selectedKeys={selectedKey ? [selectedKey] : []}
                mode="inline"
                items={menuItems}
                onClick={handleMenuClick}
                className={styles.siderMenu}
              />
            </Col>
          </Row>
        </Col>
        <Col className={styles.siderFooter}>
          <Row align={'middle'}>
            <Col span={24}>
              <Link to={ROUTE_PATHS.RESET_PASSWORD} className="w-100">
                <Button
                  type="link"
                  className={`reset-password ${location.pathname === ROUTE_PATHS.RESET_PASSWORD ? styles.active : ''}`}
                  icon={<ResetPasswordIcon />}
                  block
                >
                  Reset Password
                </Button>
              </Link>
            </Col>
            <Col span={24}>
              <Divider className={styles.divider} />
            </Col>
            <Col span={24}>
              <Row
                className={`cursor-pointer ${location.pathname === ROUTE_PATHS.PROFILE ? styles.profile : ''}`}
                gutter={[12, 12]}
                wrap={false}
                justify={'center'}
                align="middle"
              >
                <Col onClick={() => navigate(ROUTE_PATHS.PROFILE)}>
                  <Row>
                    <Col span={24}>
                      <p className={styles.name}>{truncateText(userName, 13)}</p>
                    </Col>
                    <Col span={24}>
                      <p className={styles.userName}>{truncateText(userEmail, 12)}</p>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <LogoutOutlined className={styles.logoutIcon} onClick={logOut} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Sider>
  );
};

export default AppSider;
