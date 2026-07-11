import styles from './Modal.module.css';

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Controls modal visibility.
 * @property {function} onClose - Callback when modal should close.
 * @property {React.ReactNode} children - Modal content.
 * @property {string} [title] - Optional modal title.
 */

/**
 * Reusable Modal component with backdrop and close functionality.
 * Supports keyboard ESC key to close and clicking backdrop to close.
 *
 * @param {ModalProps} props
 * @returns {JSX.Element} The rendered modal element.
 *
 * @example
 * <Modal isOpen={showModal} onClose={handleClose}>
 *   <p>Modal content here</p>
 * </Modal>
 */
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick} onKeyDown={handleKeyDown} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.content}>{children}</div>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;
