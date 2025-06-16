// Arquivo: frontend/src/components/ListaAgendamentos.jsx
import React from 'react';

// 1. Importações do MUI
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ListaAgendamentos({ agendamentos, loading, error, onEdit, onDelete }) {

  // ... (if loading, if error...)

  return (
    <div>
      <h2>Agendamentos Confirmados</h2>
      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {agendamentos.map((ag) => (
            <li key={ag._id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px', borderRadius: '8px' }}>
              <strong>{new Date(ag.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às {ag.hora}</strong> - {ag.nomeCliente} ({ag.veiculo} / {ag.placa})
              <br />
              Serviço: {ag.servico}
              
              {/* 2. Usando o Stack para alinhar e espaçar os botões */}
              <Stack direction="row" spacing={1} sx={{ marginTop: '10px' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<EditIcon />} 
                  onClick={() => onEdit(ag)}
                >
                  Editar
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small" 
                  startIcon={<DeleteIcon />} 
                  onClick={() => onDelete(ag._id)}
                >
                  Deletar
                </Button>
              </Stack>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaAgendamentos;