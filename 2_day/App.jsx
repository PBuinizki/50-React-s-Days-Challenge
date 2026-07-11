import { useState } from 'react';
import Button from './components/Button';
import Modal from './components/Modal';
import './App.css';

/**
 * Root application component.
 * Demonstrates the Modal with three different use cases.
 *
 * @returns {JSX.Element}
 */
function App() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (id) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="app-container">
      <header>
        <h1>🚀 50 Days of React</h1>
        <p>Day 2: Компонент Modal</p>
      </header>

      <main className="demo-grid">
        <section className="variant-group">
          <h2 className="variant-title">Попробуй модалки</h2>
          <div className="button-row">
            <Button variant="primary" onClick={() => openModal('info')}>
              Открыть Info
            </Button>
            <Button variant="secondary" onClick={() => openModal('form')}>
              Открыть Form
            </Button>
            <Button variant="danger" onClick={() => openModal('confirm')}>
              Удалить аккаунт
            </Button>
          </div>
          <p className="hint">
            Закрытие: крестик, клик по фону или клавиша <kbd>Esc</kbd>
          </p>
        </section>
      </main>

      <Modal
        isOpen={activeModal === 'info'}
        onClose={closeModal}
        title="Добро пожаловать 👋"
      >
        <p>
          Это информационная модалка. Обрати внимание: скролл страницы
          заблокирован, пока она открыта.
        </p>
        <Button variant="primary" onClick={closeModal}>
          Понятно
        </Button>
      </Modal>

      <Modal
        isOpen={activeModal === 'form'}
        onClose={closeModal}
        title="Обратная связь"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Форма отправлена!');
            closeModal();
          }}
          className="demo-form"
        >
          <label className="demo-label">
            Ваше сообщение
            <textarea rows="4" placeholder="Напишите что-нибудь..." />
          </label>
          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={closeModal}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Отправить
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={activeModal === 'confirm'}
        onClose={closeModal}
        title="Удалить аккаунт?"
      >
        <p>
          Это действие нельзя отменить. Все ваши данные будут удалены навсегда.
        </p>
        <div className="form-actions">
          <Button variant="secondary" onClick={closeModal}>
            Отмена
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              alert('Аккаунт удалён (демо)');
              closeModal();
            }}
          >
            Удалить
          </Button>
        </div>
      </Modal>

      <footer>
        <p>Сделано с ❤️ в рамках челленджа</p>
      </footer>
    </div>
  );
}

export default App;