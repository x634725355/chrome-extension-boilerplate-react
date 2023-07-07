import React, { useState } from 'react';
import { Switch, Card } from 'antd';
import './Popup.css';
import { POPUP_INIT, POPUP_SUBMIT } from '../Background/constant';
import { useEffect } from 'react';

const Popup = () => {
  const [open, setOpen] = useState(false);

  function openChange(value) {
    setOpen(value);
    chrome.runtime.sendMessage({ type: POPUP_SUBMIT, open: value });
  }

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
      <main className="main"></main>
    </div>
  );
};

export default Popup;
