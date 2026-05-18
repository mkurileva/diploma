export default function HintModal({ isOpen, onClose, onAuthClick }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content hint-modal">
        <div className="hint-icon">💡</div>
        <h3>Хотите сохранить эту мысль?</h3>
        <p>
          Чтобы создавать заметки и выделять текст, пожалуйста, войдите в свой аккаунт. 
          Это позволит вам возвращаться к любимым моментам с любого устройства.
        </p>
        <div className="modal-actions">
          <button className="btn-modal-primary" onClick={onAuthClick}>Войти или зарегистрироваться</button>
          <button className="btn-modal-secondary" onClick={onClose}>Продолжить как гость</button>
        </div>
      </div>
    </div>
  );
}