// src/components/ConfirmationModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ConfirmationModal.css'; // Import the CSS file for custom styles

const ConfirmationModal = ({ show, handleClose, handleConfirm, message }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Action</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="btn-no" onClick={handleClose}>
                    No
                </Button>
                <Button variant="success" className="btn-yes" onClick={handleConfirm}>
                    Yes, Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
