import React from 'react';

function ListaAgendamentos({ agendamentos, loading, error, onEdit, onDelete }) {

  if (loading) {
    return <p>Carregando agendamentos...</p>;
  }

  if (error) {
    return <p>Erro: {error}</p>;
  }

  return (
    <div>
      <h2>Agendamentos Confirmados</h2>
      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul>
          {agendamentos.map((ag) => (
            <li key={ag._id}>
              <strong>{new Date(ag.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {ag.hora}</strong> - {ag.nomeCliente} ({ag.veiculo} / {ag.placa})
              <br />
              Serviço: {ag.servico}
              <button 
                onClick={() => onDelete(ag._id)} 
                style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Deletar
              </button>
              <button
                onClick={() => onEdit(ag)}
                style={{ marginLeft: '10px', backgroundColor: 'yellow', color: 'black', border: 'none', cursor: 'pointer' }}
                >
                 Editar   
                </button>
            </li>
            
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaAgendamentos;