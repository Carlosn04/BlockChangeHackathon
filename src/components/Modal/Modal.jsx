// Modal.js
import React from 'react';
import './Modal.css';

function Modal({ show, onClose, children }) {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
                <button className="modal-close" onClick={onClose}>
                <i className="fas fa-times"></i> Close</button>
            </div>
        </div>

    );
}

export default Modal;