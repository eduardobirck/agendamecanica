import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function AgendamentoForm({ onSave, agendamentoParaEditar, onCancelEdit }) {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [servico, setServico] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
  }, [agendamentoParaEditar]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ data, hora, nomeCliente, servico, veiculo, placa, telefone });
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2, border: '1px solid #ddd', borderRadius: 2 }}
    >
      <Typography variant="h5" component="h2">
        {agendamentoParaEditar ? 'Editar Agendamento' : 'Novo Agendamento'}
      </Typography>
      
      {/* O TextField substitui o label e o input */}
      <TextField label="Data" type="date" value={data} onChange={e => setData(e.target.value)} required InputLabelProps={{ shrink: true }} />
      <TextField label="Hora" type="time" value={hora} onChange={e => setHora(e.target.value)} required InputLabelProps={{ shrink: true }} />
      <TextField label="Nome do Cliente" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} required />
      <TextField label="Serviço" value={servico} onChange={e => setServico(e.target.value)} required />
      <TextField label="Veículo (Modelo)" value={veiculo} onChange={e => setVeiculo(e.target.value)} />
      <TextField label="Placa do Veículo" value={placa} onChange={e => setPlaca(e.target.value)} required />
      <TextField label="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />

      <Stack direction="row" spacing={2}>
        <Button type="submit" variant="contained">
          {agendamentoParaEditar ? 'Salvar Alterações' : 'Agendar'}
        </Button>
        {agendamentoParaEditar && (
          <Button variant="text" onClick={onCancelEdit}>
            Cancelar Edição
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default AgendamentoForm;