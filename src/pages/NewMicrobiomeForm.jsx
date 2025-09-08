import React from "react";
import "./NewMicrobiomeForm.css";

export default function NewMicrobiomeForm() {
  return (
    <div className="new-microbiome-form-wrapper">
      <form className="new-microbiome-form">
        <div className="form-header">
          <h2>Register Your Kit</h2>
        </div>
        <div className="form-grid">
          {/* Example fields, replace/add as needed */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="kitId">Kit ID</label>
            <input type="text" id="kitId" name="kitId" />
          </div>
          {/* Add more fields as per your requirements */}
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
