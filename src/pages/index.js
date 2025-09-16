// import React from "react";
// import "../App.css"; // Import the CSS file
// import { FaSearch } from "react-icons/fa"; // Import search icon
// import Home from "../Components/home";

// const index = () => {
//   return (
//     <Home>
//       <div
//         className="myform"
//         style={{ position: "absolute", top: "10%", left: "67%", gap: "50px" }}
//       >
//         <h1 className="search-heading">Register Your Kit</h1>
//         <div className="search-container">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             className="search-bar"
//             placeholder="Search your test"
//           />
//         </div>
//       </div>
//     </Home>
//   );
// };

// export default index;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; 
import Home from "../Components/home";
import { menuItems } from "../constants/menuItems";
import "../App.css"; 
import { message } from "antd";

const Index = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    console.log("Search triggered:", query);

    const searchQuery = query.toLowerCase().trim();

    const matchedItem = menuItems.find((item) =>
      item.label.props.children.toLowerCase().includes(searchQuery)
    );

    console.log("Matched Item:", matchedItem);

    if (matchedItem) {
      navigate(matchedItem.label.props.href);
    } else {
      // alert("No matching test found. Please try again.");
      message.error("No matching found. Please try again.");
    }
  };

  return (
    <Home>
      <div className="myform myindex">
        <div className="search-heading-container">
        <h1 className="search-heading">Register Your Kit</h1>
        </div>
        <form className="search-container" style={{padding:"0px"}} onSubmit={handleSearch}>
          <FaSearch 
            className="search-icon"
            onClick={handleSearch} 
            style={{ cursor: "pointer", fontSize: "20px" }} // Ensures clickability
          />
          <input
            type="text"
            className="search-bar"
            placeholder="Search your test"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>
    </Home>
  );
};

export default Index;
