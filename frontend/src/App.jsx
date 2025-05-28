// Em frontend/src/App.jsx

import React from 'react';
import AgendamentoForm from './components/AgendamentoForm'; 
import './App.css'; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Agenda da Oficina Mecânica</h1>
      </header>
      <main>
        <AgendamentoForm /> {/* Renderiza o formulário de agendamento */}
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Meu Projeto da Faculdade</p>
      </footer>
    </div>
  );
}

export default App;