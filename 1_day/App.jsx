import Button from './components/Button';
import './App.css';

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
          <div key={variant} className="variant-group">
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
          </div>
        ))}
      </main>
      
      <footer>
        <p>Сделано с ❤️ в рамках челленджа</p>
      </footer>
    </div>
  );
}

export default App;