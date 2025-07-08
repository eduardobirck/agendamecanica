import React, { useState, useEffect } from 'react';

import { Button, TextField, Grid, Box, FormControl, InputLabel, Select, MenuItem,  } from '@mui/material';

function AgendamentoForm({ onSave, agendamentoParaEditar, onCancel, availableSlots = []  }) {
  const [hora, setHora] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [servico, setServico] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [telefone, setTelefone] = useState('');

   useEffect(() => {
    if (agendamentoParaEditar) {
      setNomeCliente(agendamentoParaEditar.nomeCliente || '');
      setServico(agendamentoParaEditar.servico || '');
      setVeiculo(agendamentoParaEditar.veiculo || '');
      setPlaca(agendamentoParaEditar.placa || '');
      setTelefone(agendamentoParaEditar.telefone || '');
      setHora(agendamentoParaEditar.hora || '');
    } else {
      setNomeCliente(''); setServico(''); setVeiculo(''); setPlaca(''); setTelefone(''); setHora('');
    }
  }, [agendamentoParaEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nomeCliente, servico, veiculo, placa, telefone, hora });
  };

  const isEditMode = !!agendamentoParaEditar;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth required disabled={availableSlots.length === 0 && !isEditMode}>
            <InputLabel id="select-time-label">Hora</InputLabel>
            <Select
              labelId="select-time-label"
              value={hora}
              label="Hora"
              onChange={(e) => setHora(e.target.value)}
            >
              {availableSlots.map(slot => (
                <MenuItem key={slot} value={slot}>{slot}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}><TextField fullWidth label="Seu Nome Completo" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} required /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Serviço Desejado" value={servico} onChange={(e) => setServico(e.target.value)} required /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Veículo (Modelo)" value={veiculo} onChange={(e) => setVeiculo(e.target.value)} /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth label="Placa do Veículo" value={placa} onChange={(e) => setPlaca(e.target.value)} required /></Grid>
        <Grid item xs={12}><TextField fullWidth label="Telefone para Contato" value={telefone} onChange={(e) => setTelefone(e.target.value)} /></Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained">
          {isEditMode ? 'Salvar Alterações' : 'Confirmar Agendamento'}
        </Button>
        {isEditMode && <Button onClick={onCancel}>Cancelar</Button>}
      </Box>
    </Box>
  );
}

export default AgendamentoForm;