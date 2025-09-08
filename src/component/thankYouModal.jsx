import React from "react";
import "./CSS/thankYouModal.css";

const ThankYouModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}></button>
        {/* You can add an image here if needed */}
        <h2>Thank you</h2>
        <p>{title}</p>
        <p className="subtext">{message}</p>
      </div>
    </div>
  );
};

export default ThankYouModal;
