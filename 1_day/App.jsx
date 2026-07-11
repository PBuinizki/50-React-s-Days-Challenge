import Button from './components/Button';
import './App.css';

/**
 * Root application component.
 * Renders a demo showcase for the Button component,
 * displaying all combinations of variants and sizes.
 *
 * @returns {JSX.Element} The rendered demo page.
 */
function App() {
  const variants = ['primary', 'secondary', 'danger'];
  const sizes = ['small', 'medium', 'large'];

  return (
    <div className="app-container">
      <header>
        <h1>🚀 50 Days of React</h1>
        <p>Day 1: Компонент Button (Варианты и Размеры)</p>
      </header>

      <main className="demo-grid">
        {variants.map((variant) => (
          <section key={variant} className="variant-group">
            <h2 className="variant-title">{variant}</h2>
            <div className="button-row">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant={variant}
                  size={size}
                  onClick={() => alert(`Нажата: ${variant} ${size}`)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer>
        <p>Сделано с ❤️ в рамках челленджа</p>
      </footer>
    </div>
  );
}

export default App;