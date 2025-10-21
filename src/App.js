

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
import NewMicrobiomeForm from "./pages/NewMicrobiomeForm";
import NewMicrobiomeFormFull from "./pages/NewMicrobiomeForm.full";
import SampleReturnForm from "./pages/SampleReturnForm";
import RegisterYourFST from "./pages/registerYourFST";
import Postage from "./pages/postage";



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
        <Route path="/form" element={<NewMicrobiomeFormFull />} />
        <Route path="/thankyou" element={<Thankyou />} />
        <Route path="/thank-you" element={<Thankyou2 />} />
        <Route path="/thank-youu" element={<NewMicrobiomeFormFull />} />
        <Route path="/dnaform" element={<NewMicrobiomeFormFull />} />
        <Route path="/foodsensitivityform" element={<NewMicrobiomeFormFull />} />
        <Route path="/parasitologyform" element={<NewMicrobiomeFormFull />} />
        <Route path="/candidaform" element={<NewMicrobiomeFormFull />} />
        <Route path="/labrecieved" element={<LabRecieved />} />
        <Route path="/postage" element={<Postage />} />
        <Route path="/oralmicrobiomeform" element={<NewMicrobiomeFormFull />} />
  
  <Route path="/new-microbiome-form" element={<NewMicrobiomeForm />} />
  <Route path="/registeryourkits" element={<NewMicrobiomeFormFull />} />
  <Route path="/registeryourfst" element={<RegisterYourFST />} />

        <Route path="/samplereturn" element={<SampleReturnForm />} />
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
