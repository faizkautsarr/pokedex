import "../assets/css/modal.css";
export default function Modal({ handleOverlayClick, closeModal, children }) {
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-wrapper">
        <span className="modal-close-button" onClick={closeModal}>
          x
        </span>

        <div className="modal-content-scrollable">{children}</div>
      </div>
    </div>
  );
}
