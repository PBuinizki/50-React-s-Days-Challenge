import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Controls modal visibility.
 * @property {() => void} onClose - Callback fired when modal should close.
 * @property {string} title - Modal heading text, linked via aria-labelledby.
 * @property {React.ReactNode} children - Modal body content.
 */

/**
 * Accessible modal dialog rendered via portal into document.body.
 * Closes on overlay click, close button, or Escape key.
 * Locks body scroll while open and restores previous overflow on unmount.
 *
 * @param {ModalProps} props
 * @returns {JSX.Element | null}
 *
 * @example
 * <Modal isOpen={show} onClose={() => setShow(false)} title="Confirm">
 *   Are you sure?
 * </Modal>
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // useId генерирует стабильный уникальный ID между рендерами и сервером/клиентом.
  // Нужен, чтобы связать aria-labelledby с заголовком без хардкода строки.
  const titleId = useId();

  // Lock body scroll while modal is open.
  // Cleanup restores the previous overflow value, so we don't break
  // nested modals or pages that already had overflow: hidden.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Close on Escape key. Listener is attached only while modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Nothing to render when closed — avoids mounting invisible DOM.
  if (!isOpen) return null;

  // Close only when clicking the overlay itself, not the dialog inside it.
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modal = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className={styles.dialog}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );

  // Portal renders the modal outside the React tree, directly into <body>.
  // This prevents z-index stacking issues when a parent has overflow: hidden.
  return createPortal(modal, document.body);
};

export default Modal;