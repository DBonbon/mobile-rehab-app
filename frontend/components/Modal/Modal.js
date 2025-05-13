// import PropTypes from 'prop-types';
import s from './Modal.module.css';
import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={`${s.modalBackdrop} fixed inset-0 flex items-center justify-center`}>
      <div className="modal">
        <div className="modal-header">
          this header
          <button className="" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          modal body go home
        {children}
        </div>
        <div className="modal-footer">



        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export const ModalHeader = ({ children }) => (
  <div className="modal-header">
    {children}
  </div>
);

export const ModalBody = ({ children }) => (
  <div className="modal-body">
    {children}
  </div>
);

export const ModalFooter = ({ children }) => (
  <div className="modal-footer">
    {children}
  </div>
);

export default Modal;
