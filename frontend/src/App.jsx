import React, { useState, useEffect } from 'react'; // Importamos os hooks aqui
import AgendamentoForm from './components/AgendamentoForm';
import ListaAgendamentos from './components/ListaAgendamentos';
import './App.css';

function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState(null);

  const fetchAgendamentos = async () => {
    setLoading(true); 
    try {
      const response = await fetch('http://localhost:3001/api/agendamentos');
      if (!response.ok) {
        throw new Error('Falha ao buscar dados');
      }
      const data = await response.json();
      setAgendamentos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (dadosDoForm) => {
    try {
      let response;
      let agendamentoParaSalvar = {...dadosDoForm};

      if (agendamentoEmEdicao) {
        const id = agendamentoEmEdicao._id;
        response = await fetch(`http://localhost:3001/api/agendamentos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(agendamentoParaSalvar),
      });
    } else {
      response = await fetch('http://localhost:3001/api/agendamentos', {
        method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agendamentoParaSalvar),
        });
    }

    if (!response.ok) {
      throw new Error('Falha ao salvar agendamento');
    }

    setAgendamentoEmEdicao(null);
    fetchAgendamentos();

  } catch(err) {
      console.error("Erro ao salvar", err);
      alert(`Erro: ${err.message}`);  
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []); 

  
  const handleAgendamentoSalvo = () => {
    fetchAgendamentos(); 
  };

  const handleDelete = async (id) => {
    // Confirmação com o usuário
    if (window.confirm('Tem certeza que deseja deletar este agendamento?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/agendamentos/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Falha ao deletar o agendamento');
        }

        // Após deletar com sucesso, atualiza a lista
        fetchAgendamentos();
        
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert(`Erro: ${err.message}`);
      }
    }
  };

  const handleEdit = (agendamento) => {
    setAgendamentoEmEdicao(agendamento);
  };

  const handleCancelEdit = () => {
    setAgendamentoEmEdicao(null);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Agenda da Oficina Mecânica</h1>
      </header>
      <main>
        <AgendamentoForm
          onSave={handleSave}
          agendamentoParaEditar={agendamentoEmEdicao}
          onCancelEdit={handleCancelEdit}
        />  
        
        <hr />
        
        <ListaAgendamentos 
          agendamentos={agendamentos} 
          loading={loading} 
          error={error} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Meu Projeto da Faculdade</p>
      </footer>
    </div>
  );
}

export default App;