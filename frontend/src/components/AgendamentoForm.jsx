import React, { useState } from 'react'; // Importamos useState para gerenciar o estado do formulário

function AgendamentoForm() {
  // Estados para cada campo do formulário
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [servico, setServico] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [telefone, setTelefone] = useState('');

  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o recarregamento da página padrão do formulário
    const agendamento = {
      data,
      hora,
      nomeCliente,
      servico,
      veiculo,
      telefone,
    };
    console.log('Dados do Agendamento:', agendamento);
    // Aqui, no futuro, enviaremos 'agendamento' para o backend
    // Por enquanto, apenas exibimos no console.

    // Limpar campos após o envio (opcional)
    setData('');
    setHora('');
    setNomeCliente('');
    setServico('');
    setVeiculo('');
    setTelefone('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Novo Agendamento</h2>
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
        {/* Poderíamos adicionar step="3600" para pular de hora em hora se o input type="time" suportar bem */}
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
        <label htmlFor="telefone">Telefone:</label>
        <input
          type="tel"
          id="telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
      </div>
      <button type="submit">Agendar</button>
    </form>
  );
}

export default AgendamentoForm;