import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Icon, Tooltip, Collapse, notification, Button } from 'antd';
import moment from 'moment';
import Clipboard from 'clipboard';
import Prism from '../utils/prism';
import '../styles/prism.css';

const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;

const ContentContainer = styled.div`
  position: relative;
  padding-left: 570px;
  max-width: 2000px;
  padding-top: 50px;
  .gistheader {
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
    background: #fff;
    .name {
      font-size: 16px;
      color: #000;
      .anticon {
        font-size: 14px;
        margin-right: 5px;
      }
    }
    .date {
      font-size: 12px;
      color: #999;
    }
    .description {
      font-size: 14px;
      color: #666;
      margin: 10px 0;
    }
    .tags {
      font-size: 12px;
      color: #999;
      span {
        margin-right: 10px;
        .anticon {
          margin-right: 5px;
        }
      }
    }
  }
  .gistTools {
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
  }
  .gistCode {
    padding: 10px;
    background: #fff;
    .anticon {
      margin-right: 5px;
    }
    .panelHeader {
      .tools a {
        color: #999;
        margin-right: 15px;
      }
    }
  }
`;

class PanelHeader extends React.Component {
  copyFn = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  componentDidMount() {
    let clipboard = new Clipboard(this.copyBtn, {
      text: () => this.props.file.content
    });
    clipboard.on('success', () => {
      notification.success({
        message: 'Notification',
        description: 'Copy Success'
      });
    });
  }

  render() {
    return (
      <div className="panelHeader clearfix">
        <span className="fl name">
          <Icon type="file" />
          {this.props.file.filename || 'No File Name'}
        </span>
        <div className="fr clearfix tools">
          <a
            className="rawbtn fl"
            href={this.props.file.raw_url}
            onClick={e => e.stopPropagation()}
            target="_blank"
          >
            <Icon type="link" />Raw
          </a>
          <a
            className="copyBtn fl"
            href="#"
            target="_blank"
            onClick={this.copyFn}
            ref={dom => {
              this.copyBtn = dom;
            }}
          >
            <Icon type="copy" />Copy
          </a>
        </div>
      </div>
    );
  }
}

PanelHeader.propTypes = {
  file: PropTypes.object.isRequired
};


@inject('store')
@observer
class Content extends React.Component {
  componentDidMount() {
    Prism.highlightAll();
  }

  componentDidUpdate() {
    Prism.highlightAll();
  }

  // Panel默认闭合时不显示Dom的bug ==> 待优化
  panelChange = () => {
    setTimeout(() => {
      Prism.highlightAll();
    }, 100);
  };

  render() {
    let { openGist } = this.props.store;
    // Gist切换时遗留的activeKey的bug ==> 未解决
    let defaultActiveKey = Object.keys(openGist.files).map(
      (file, index) => '' + index
    );
    return (
      <ContentContainer>
        <div className="gistheader">
          <div className="name text-ellipsis">
            {openGist.public ? (
              <Tooltip placement="bottom" title="Public">
                <Icon type="unlock" />
              </Tooltip>
            ) : (
              <Tooltip placement="bottom" title="Private">
                <Icon type="lock" />
              </Tooltip>
            )}
            {openGist.name || 'No Name'}
          </div>
          <div className="date">
            {`${Object.keys(openGist.files).length} Files – Created on ${moment(
              openGist.created_at
            ).format('YYYY-MM-DD HH:mm:ss')} – Last updated ${moment(
              openGist.updated_at
            ).format('YYYY-MM-DD HH:mm:ss')}`}
          </div>
          <div className="description">
            {openGist.description || 'No Description'}
          </div>
          <div className="tags clearfix">
            {openGist.tags.length > 0
              ? openGist.tags.map(tag => (
                  <span className="fl" key={tag}>
                    <Icon type="tags" />
                    {tag}
                  </span>
                ))
              : 'No Labels'}
          </div>
        </div>
        <div className="gistTools clearfix">
          <ButtonGroup className="fl">
            <Button icon="edit">Edit</Button>
            <Button icon="delete">Delete</Button>
          </ButtonGroup>
          <ButtonGroup className="fr">
            <Button icon="export">Open</Button>
            <Button icon="star-o">Star</Button>
            <Button icon="star">Unstar</Button>
          </ButtonGroup>
        </div>
        <div className="gistCode">
          <Collapse
            defaultActiveKey={defaultActiveKey}
            onChange={this.panelChange}
          >
            {Object.keys(openGist.files).map((file, index) => {
              let fileItem = openGist.files[file];
              return (
                <Panel
                  header={<PanelHeader file={fileItem} />}
                  key={'' + index}
                >
                  <pre className="line-numbers">
                    <code
                      className={
                        'language-' +
                        (fileItem.language || 'Text').toLowerCase()
                      }
                    >
                      {fileItem.content}
                    </code>
                  </pre>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </ContentContainer>
    );
  }
}

Content.propTypes = {
  store: PropTypes.object
};

export default Content;