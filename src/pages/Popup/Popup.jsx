import React, { useState } from 'react';
import { Switch, Card } from 'antd';
import './Popup.css';
import { POPUP_INIT, POPUP_SUBMIT } from '../Background/constant';
import { useEffect } from 'react';
import { Input } from 'antd';
import { Form } from 'antd';

const Popup = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  function openChange(value) {
    setOpen(value);
    chrome.runtime.sendMessage({ type: POPUP_SUBMIT, open: value });
  }

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function onChangeHandle(e) {}

  useEffect(() => {
    chrome.runtime.sendMessage({ message: 'popup init', type: POPUP_INIT });

    chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
      console.log('%c Line:20 🥒', 'color:#42b983', data);
      // handle message from background
      if (data.type === POPUP_INIT) {
        setOpen(data.open);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="header">
        <Switch checked={open} onChange={openChange} />
      </header>
      <main className="main">
        <div className="option">
          <div className="option-label">
            <span>URL</span>
          </div>
          <div className="option-value">
            <div>
              <Input onChange={onChangeHandle} />
            </div>
            <div>
              <Switch />
            </div>
            <div>类型</div>
            <div>功能按钮</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Popup;
