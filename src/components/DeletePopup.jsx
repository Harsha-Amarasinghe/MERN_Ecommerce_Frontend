import React from "react";
import "./DeletePopup.css"; 

const DeletePopup = ({ onCancel, onDelete }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <span className="popup-warning-icon">
            <img
              src="/assets/alert.svg"
              alt="Alert"
              className="icon"
            />
          </span>
          <h2>ARE YOU SURE?</h2>
        </div>
        <p>You will not be able to undo this action if you proceed!</p>
        <div className="popup-actions">
          <button className="popup-btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="popup-btn delete-btn" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
