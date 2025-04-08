// import './App.css';
// import { BrowserRouter, Routes, Route, useNavigate,useLocation } from 'react-router-dom';

// import Index from './pages';
// import Form from './pages/form';
// import Thankyou from './pages/thankyou';
// import Dnaform from './pages/Dnaform';
// import Thankyou2 from './pages/thankyou2';
// import Praform from './pages/praform';
// import Thankyou3 from './pages/thankyou3';
// import Fsform from './pages/fsform';
// import Candida from './pages/candida';

// const Nav = () => {
//   const navigate = useNavigate()
//   return (<>
//     <nav>
//       <div className='logo'></div>
//       {/* <div ><button className='button' onClick={() => navigate("/form")}>Register your kit</button></div> */}
//       <div><button className='button' onClick={() => navigate("/form")}>Register your microbiome kit</button></div>
//       <div><button className='button' onClick={() => navigate("/parasitologyform")}>Register your paracetology kit</button></div>
//       <div><button className='button' onClick={() => navigate("/dnaform")}>Register your dna form kit</button></div>
//       <div><button className='button' onClick={() => navigate("/foodsensitivityform")}>Register your food sensitivity kit</button></div>
//       <div><button className='button' onClick={() => navigate("/candidaform")}>Register your candida profile kit</button></div>
//     </nav>
//   </>)
// }

// function App() {
//   const location = useLocation()
//   const hideNavRoutes = ['/foodsensitivityform'];
//   return (
//     <div className="App">

//       <BrowserRouter>

//         {/* <Nav /> */}
//         {!hideNavRoutes.includes(location.pathname) && <Nav />}
//         <Routes>

//           <Route path='/' element={<Index />} />
//           <Route path='/form' element={<Form />} />
//           <Route path='/thankyou' element={<Thankyou />} />
//           <Route path='/thank-you' element={<Thankyou2 />} />
//           <Route path='/thank-youu' element={<Thankyou3 />} />
//           <Route path='/dnaform' element={<Dnaform />} />
//           <Route path='/foodsensitivityform' element={<Fsform />} />
//           <Route path='/parasitologyform' element={<Praform />} />
//           <Route path='/candidaform' element={<Candida />} />

//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;

import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";
import Index from "./pages";
import Form from "./pages/form";
import Thankyou from "./pages/thankyou";
import Dnaform from "./pages/Dnaform";
import Thankyou2 from "./pages/thankyou2";
import Praform from "./pages/praform";
import Thankyou3 from "./pages/thankyou3";
import Fsform from "./pages/fsform";
import Candida from "./pages/candida";
import LabRecieved from "./pages/labRecieved";
import OralMicrobiome from "./pages/oralmicro";

// const Nav = () => {
//   const navigate = useNavigate();
//   return (
//     <nav>
//       <div className="logo"></div>
//       <div>
//         <button className="button" onClick={() => navigate("/form")}>
//           Register your microbiome kit
//         </button>
//       </div>
//       <div>
//         <button
//           className="button"
//           onClick={() => navigate("/parasitologyform")}
//         >
//           Register your parasitology kit
//         </button>
//       </div>
//       <div>
//         <button className="button" onClick={() => navigate("/dnaform")}>
//           Register your DNA form kit
//         </button>
//       </div>
//       <div>
//         <button
//           className="button"
//           onClick={() => navigate("/foodsensitivityform")}
//         >
//           Register your food sensitivity kit
//         </button>
//       </div>
//       <div>
//         <button className="button" onClick={() => navigate("/candidaform")}>
//           Register your candida profile kit
//         </button>
//       </div>
//     </nav>
//   );
// };



const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* <div className="logo">LOGO</div> */}
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <button className="button" onClick={() => {navigate("/form"); toggleMenu()}}>
          Register your microbiome kit
        </button>
        <button
          className="button"
          onClick={() => {navigate("/parasitologyform"); toggleMenu()}}
        >
          Register your parasitology kit
        </button>
        <button className="button" onClick={() => {navigate("/dnaform"); toggleMenu()}}>
          Register your DNA form kit
        </button>
        <button
          className="button"
          onClick={() => {navigate("/foodsensitivityform"); toggleMenu()}}
        >
          Register your food sensitivity kit
        </button>
        <button className="button" onClick={() => {navigate("/candidaform"); toggleMenu()}}>
          Register your candida profile kit
        </button>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavRoutes = ["/"];

  return (
    <>
      {!hideNavRoutes.includes(location.pathname)}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/form" element={<Form />} />
        <Route path="/thankyou" element={<Thankyou />} />
        <Route path="/thank-you" element={<Thankyou2 />} />
        <Route path="/thank-youu" element={<Thankyou3 />} />
        <Route path="/dnaform" element={<Dnaform />} />
        <Route path="/foodsensitivityform" element={<Fsform />} />
        <Route path="/parasitologyform" element={<Praform />} />
        <Route path="/candidaform" element={<Candida />} />
        <Route path="/labrecieved" element={<LabRecieved />} />
        <Route path="/oralmicrobiomeform" element={<OralMicrobiome />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
