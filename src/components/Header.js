import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import {
  Spin,
  Icon,
  Tooltip,
  Modal,
  notification,
  Button,
  Input,
  Select
} from 'antd';
import Setting from './Setting';

const InputGroup = Input.Group;
const Search = Input.Search;
const Option = Select.Option;

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  width: 100%;
  height: ${props => props.theme.headerHeight};
  line-height: ${props => props.theme.headerHeight};
  padding: 0 15px;
  background: ${props => props.theme.headerBg};
`;

@inject('store')
@observer
class Header extends React.Component {
  state = { settingVisible: false };

  // 刷新
  reload = event => {
    event.preventDefault();
    this.props.store.setLoading(true);
    this.props.store.getGists(() => {
      notification.success({
        message: 'Notification',
        description: 'Refresh Gists Success'
      });
      this.props.store.setLoading(false);
    });
  };

  // 关于
  about = event => {
    event.preventDefault();
  };

  // 设置
  setting = event => {
    event.preventDefault();
    this.setState({
      settingVisible: true
    });
  };

  // 设置 -- Ok
  settingOk = event => {
    this.setState({
      settingVisible: false
    });
  };

  // 设置 -- Cancel
  settingCancel = event => {
    this.setState({
      settingVisible: false
    });
  };

  // 登出
  logout = event => {
    event.preventDefault();
    let that = this;
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you are logged out?',
      onOk() {
        that.props.store.logout(() => {
          notification.success({
            message: 'Notification',
            description: 'Sign Out Successful！'
          });
        });
      },
      onCancel() {}
    });
  };

  componentDidMount() {}

  render() {
    let { userInfo } = this.props.store;
    return (
      <HeaderContainer className="clearfix">
        <div className="header-left fl">
          <a className="logo clearfix" href="/">
            <img className="fl" src={require('../images/icon-128.png')} />
            <span className="fl">Snippets Box</span>
          </a>
        </div>
        <div className="header-right fr clearfix">
          <div className="creat fl">
            <Button type="primary" icon="file">
              New Gist
            </Button>
          </div>
          <div className="search fl">
            <InputGroup compact>
              <Select defaultValue="Gists">
                <Option value="Gists">Gists</Option>
                <Option value="files">files</Option>
                <Option value="Labels">Labels</Option>
              </Select>
              <Search
                placeholder="Search by keyword"
                style={{ width: 150 }}
                onSearch={value => console.log(value)}
              />
            </InputGroup>
          </div>
          <div className="tools fl">
            <Tooltip placement="bottom" title="Refresh Gists">
              <a href="#" onClick={this.reload}>
                <Icon type="reload" />
              </a>
            </Tooltip>
            <Tooltip placement="bottom" title="Setting">
              <a href="#" onClick={this.setting}>
                <Icon type="setting" />
              </a>
            </Tooltip>
            <Tooltip placement="bottom" title="About">
              <a href="#" onClick={this.about}>
                <Icon type="question-circle-o" />
              </a>
            </Tooltip>
          </div>
          <div className="profile fl">
            <Tooltip placement="bottom" title="Open Github Gist">
              <a
                className="name"
                href={`https://gist.github.com/${userInfo.login}`}
                target="_blank"
              >
                <Icon type="github" />
                {userInfo.login}
              </a>
            </Tooltip>
            <a href="#" onClick={this.logout}>
              <Icon type="logout" />
              Logout
            </a>
          </div>
        </div>
        <Modal
          title="Setting"
          visible={this.state.settingVisible}
          onOk={this.settingOk}
          onCancel={this.settingCancel}
        >
          <Setting />
        </Modal>
      </HeaderContainer>
    );
  }
}

Header.propTypes = {
  store: PropTypes.object
};

export default Header;
