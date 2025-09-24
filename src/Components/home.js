import React from 'react';
import "../App.css"; // Import the CSS file
import { Button, Dropdown, Space } from "antd";
import { FaSearch } from "react-icons/fa"; // Import search icon
import { menuItems } from "../constants/menuItems"; // Import menu items

const Home = (props) => {
  return (
    <div className="data">
      <div className="first-row">
        <p className="main-heading">
          GutHealth<span>Lab</span>
        </p>
        <Space direction="vertical">
          <Space wrap>
            <Dropdown
              menu={{
                items: menuItems,
              }}
              placement="bottom"
            >
                 <Button className="mybutton">Forms <span style={{fontSize: '0.8em', verticalAlign: 'middle', color:""}}>&#9660;</span></Button>
            </Dropdown>
          </Space>
        </Space>
      </div>
      <div className="image-container">
        <img src="bghome.png" className="myimage" alt="GutHealthLab" />
        {props.children}
      </div>
    </div>
  );
}

export default Home;