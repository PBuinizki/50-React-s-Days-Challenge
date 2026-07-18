import { useState } from 'react';
import Button from './components/Button/Button';
import Modal from './components/Modal/Modal';
import Tabs from './components/Tabs/Tabs';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

/**
 * Root application component.
 * Demonstrates the Tabs component in three scenarios:
 * static tabs, tabs with rich content, and controlled mode.
 *
 * @returns {JSX.Element}
 */
function App() {
  const [count, setCount] = useLocalStorage('demo-counter', 0);
  const [theme, setTheme] = useLocalStorage('demo-theme', 'light');

  // Controlled tabs: parent owns the active state.
  const [controlledTab, setControlledTab] = useState('overview');

  const simpleTabs = [
    { id: 'first', label: 'Первая', content: <p>Содержимое первой вкладки.</p> },
    { id: 'second', label: 'Вторая', content: <p>Содержимое второй вкладки.</p> },
    { id: 'third', label: 'Третья', content: <p>Содержимое третьей вкладки.</p> },
  ];

  const richTabs = [
    {
      id: 'profile',
      label: 'Профиль',
      content: (
        <div>
          <h3>Иван Иванов</h3>
          <p>Email: ivan@example.com</p>
          <p>Роль: Разработчик</p>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Настройки',
      content: (
        <form className="demo-form" onSubmit={(e) => e.preventDefault()}>
          <label className="demo-label">
            Имя
            <input type="text" defaultValue="Иван" />
          </label>
          <label className="demo-label">
            Уведомления
            <select>
              <option>Все</option>
              <option>Только важные</option>
              <option>Выключены</option>
            </select>
          </label>
          <Button variant="primary" type="submit">
            Сохранить
          </Button>
        </form>
      ),
    },
    {
      id: 'disabled',
      label: 'Заблокировано',
      disabled: true,
      content: <p>Этот контент не отобразится.</p>,
    },
  ];

  const controlledTabs = [
    {
      id: 'overview',
      label: 'Обзор',
      content: <p>Это обзор проекта. Выбрана вкладка: <strong>{controlledTab}</strong></p>,
    },
    {
      id: 'stats',
      label: 'Статистика',
      content: (
        <div>
          <p>Счётчик: <strong>{count}</strong></p>
          <div className="button-row">
            <Button variant="secondary" onClick={() => setCount((p) => p - 1)}>−1</Button>
            <Button variant="primary" onClick={() => setCount(0)}>Сброс</Button>
            <Button variant="primary" onClick={() => setCount((p) => p + 1)}>+1</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="app-container">
      <header>
        <h1>🚀 50 Days of React</h1>
        <p>Day 4: Компонент Tabs</p>
      </header>

      <main className="demo-grid">
        <section className="variant-group">
          <h2 className="variant-title">Простые табы</h2>
          <Tabs tabs={simpleTabs} />
          <p className="hint">
            Попробуй навигацию: <kbd>←</kbd> <kbd>→</kbd> <kbd>Home</kbd> <kbd>End</kbd>
          </p>
        </section>

        <section className="variant-group">
          <h2 className="variant-title">Табы с разным контентом</h2>
          <Tabs tabs={richTabs} />
          <p className="hint">Третья вкладка заблокирована через prop <code>disabled</code>.</p>
        </section>

        <section className="variant-group">
          <h2 className="variant-title">Controlled режим</h2>
          <Tabs
            tabs={controlledTabs}
            defaultActiveId={controlledTab}
            onChange={setControlledTab}
          />
          <p className="hint">Родитель управляет активной вкладкой через <code>onChange</code>.</p>
        </section>
      </main>

      <footer>
        <p>Сделано с ❤️ в рамках челленджа</p>
      </footer>
    </div>
  );
}

export default App;