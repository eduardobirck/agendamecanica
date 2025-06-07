import React, { useState, useEffect } from 'react';


function AgendamentoForm({ onSave, agendamentoParaEditar, onCancelEdit }) {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [servico, setServico] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    if (agendamentoParaEditar) {
      const dataFormatada = new Date(agendamentoParaEditar.data).toISOString().split('T')[0];
      
      setData(dataFormatada);
      setHora(agendamentoParaEditar.hora);
      setNomeCliente(agendamentoParaEditar.nomeCliente);
      setServico(agendamentoParaEditar.servico);
      setVeiculo(agendamentoParaEditar.veiculo);
      setPlaca(agendamentoParaEditar.placa);
      setTelefone(agendamentoParaEditar.telefone);
    } else {
      // Se não, limpamos o formulário (modo de criação)
      setData(''); setHora(''); setNomeCliente(''); setServico('');
      setVeiculo(''); setPlaca(''); setTelefone('');
    }
  }, [agendamentoParaEditar]); // Este efeito roda sempre que 'agendamentoParaEditar' mudar

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ data, hora, nomeCliente, servico, veiculo, placa, telefone });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{agendamentoParaEditar ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
      <div>
        <label htmlFor="data">Data:</label>
        <input
          type="date"
          id="data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="hora">Hora:</label>
        <input
          type="time" step="3600"
          id="hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />
        
      </div>
      <div>
        <label htmlFor="nomeCliente">Nome do Cliente:</label>
        <input
          type="text"
          id="nomeCliente"
          value={nomeCliente}
          onChange={(e) => setNomeCliente(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="servico">Serviço:</label>
        <input
          type="text"
          id="servico"
          value={servico}
          onChange={(e) => setServico(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="veiculo">Veículo (Modelo/Placa):</label>
        <input
          type="text"
          id="veiculo"
          value={veiculo}
          onChange={(e) => setVeiculo(e.target.value)}
        />
      </div>
      <div>
            <label htmlFor="placa">Placa do Veículo:</label>
            <input
              type="text"
              id="placa"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              required
            />
      </div>
      <div>
        <label htmlFor="telefone">Telefone:</label>
        <input
          type="tel"
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>
      <button type="submit">{agendamentoParaEditar ? 'Salvar Alterações' : 'Agendar'}</button>
      {agendamentoParaEditar && (
        <button type="button" onClick={onCancelEdit}>Cancelar Edição</button>
      )}
    </form>
  );
}

export default AgendamentoForm;