import React, { useState } from 'react';
import './Popup.css';
import { POPUP_INIT, POPUP_SUBMIT, HTTP_METHOD } from '../Background/constant';
import { useEffect } from 'react';
import { Button, Input, Select, Switch } from 'antd';

const Popup = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [initiator, setInitiator] = useState('');

  function openChange(value) {
    setOpen(value);
    chrome.runtime.sendMessage({ type: POPUP_SUBMIT, open: value });
  }

  function addOption() {
    const tempOptions = [
      ...options,
      {
        url: '',
        open: false,
        method: 'GET',
        key: +new Date(),
      },
    ];
    setOptions(tempOptions);
    chrome.runtime.sendMessage({ type: POPUP_SUBMIT, options: tempOptions });
  }

  function deleteOption(index) {
    const tempOptions = options.filter((p, i) => i !== index);
    setOptions(tempOptions);
    chrome.runtime.sendMessage({ type: POPUP_SUBMIT, options: tempOptions });
  }

  const handleChange = ({ value, index, key }) => {
    console.log(`selected ${value}`);
    options[index][key] = value;
    setOptions([...options]);
    chrome.runtime.sendMessage({ type: POPUP_SUBMIT, options });
  };

  const handleInitiator = (e) => {
    setInitiator(e.target.value);
    chrome.runtime.sendMessage({ type: POPUP_SUBMIT, initiator });
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ message: 'popup init', type: POPUP_INIT });

    chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
      console.log('%c Line:20 🥒', 'color:#42b983', data);
      // handle message from background
      if (data.type === POPUP_INIT) {
        setOpen(data.open);
        setOptions(data.options);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="header">
        <Switch checked={open} onChange={openChange} />
        <span style={{ width: '8px' }}></span>
        <Button onClick={addOption} type="primary">
          ADD
        </Button>
        <span style={{ width: '8px' }}></span>
        <span>完整域名:</span>
        <span style={{ width: '8px' }}></span>
        <Input
          style={{ width: 300 }}
          value={initiator}
          onChange={handleInitiator}
        ></Input>
      </header>
      <main className="main">
        {options.map((option, index) => (
          <div key={option.key} className="option">
            <div className="option-label">
              <span>URL</span>
            </div>
            <div className="option-value">
              <div>
                <Input
                  value={option.url}
                  onChange={(e) =>
                    handleChange({ value: e.target.value, index, key: 'url' })
                  }
                />
              </div>
              <div>
                <Switch
                  checked={option.open}
                  onChange={(value) =>
                    handleChange({ value, index, key: 'open' })
                  }
                />
              </div>
              <div>
                <Select
                  style={{ width: 120 }}
                  value={option.method}
                  onChange={(value) =>
                    handleChange({ value, index, key: 'method' })
                  }
                  options={HTTP_METHOD.map((method) => ({
                    value: method,
                    label: method,
                  }))}
                />
              </div>
              <div>
                <Button onClick={() => deleteOption(index)} danger>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Popup;
