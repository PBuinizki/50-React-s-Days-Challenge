import InfiniteList from './components/InfiniteList/InfiniteList';
import './App.css';

/**
 * Root application component for Day 5.
 * Renders a clean, focused demo of the infinite-scrolling product feed.
 *
 * @returns {JSX.Element}
 */
function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚀 50 Days of React</h1>
        <p className="subtitle">День 5: Бесконечная лента (Infinite Scroll)</p>
      </header>

      <main className="demo-main">
        <section className="demo-section">
          <InfiniteList title="Каталог товаров" />
          <p className="hint">
            Прокручивай вниз — новые товары подгружаются автоматически 
            с помощью <code>IntersectionObserver</code> и кастомного хука.
          </p>
        </section>
      </main>

      <footer className="app-footer">
        <p>Сделано с ❤️ в рамках челленджа #50DaysOfReact</p>
      </footer>
    </div>
  );
}

export default App;