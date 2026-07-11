import { useState } from 'react';
import Button from './components/Button';
import Modal from './components/Modal';
import './App.css';

/**
 * Root application component.
 * Renders a demo showcase for the Modal component,
 * displaying different modal variations and states.
 *
 * @returns {JSX.Element} The rendered demo page.
 */
function App() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="app-container">
      <header>
        <h1>🚀 50 Days of React</h1>
        <p>Day 2: Компонент Modal (Модальные окна)</p>
      </header>

      <main className="demo-area">
        <Button
          variant="primary"
          size="medium"
          onClick={() => setIsOpen(true)}
        >
          С простым текстом
        </Button>

        <div className="variant-group">
          <h2 className="variant-title">Примеры контента</h2>
          <div className="button-row">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setIsOpen(true)}
            >
              С простым текстом
            </Button>
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setIsOpen(true)}
            >
               С заголовком
            </Button>
          </div>
        </div>
      </main>

      <footer>
        <p>Сделано с ❤️ в рамках челленджа</p>
      </footer>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <p>Это содержимое модального окна. Вы можете закрыть его, нажав на крестик, вне области модального окна или клавишу ESC.</p>
      </Modal>
    </div>
  );
}

export default App;
