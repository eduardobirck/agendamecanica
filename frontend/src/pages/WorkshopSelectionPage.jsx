import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { Link as RouterLink } from 'react-router-dom';

import { Box, Card, CardContent, CardActionArea, CircularProgress, Typography, Grid } from '@mui/material';

function WorkshopSelectionPage() {
  const [oficinas, setOficinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOficinas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/oficinas/public');
      setOficinas(response.data);
    } catch (err) {
      console.error("Erro ao buscar oficinas:", err);
      setError("Não foi possível carregar a lista de oficinas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOficinas();
  }, [fetchOficinas]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Oficinas Disponíveis
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Selecione uma oficina abaixo para ver os horários e fazer seu agendamento.
      </Typography>
      
      <Grid container spacing={3}>
        {oficinas.map((oficina) => (
          <Grid item xs={12} sm={6} md={4} key={oficina._id}>
            {/* CardActionArea faz o card inteiro ser clicável */}
            <CardActionArea component={RouterLink} to={`/oficina/${oficina._id}`} sx={{ height: '100%' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h2">{oficina.nome}</Typography>
                  <Typography sx={{ mt: 1.5 }}>
                    {`${oficina.endereco.rua}, ${oficina.endereco.numero || 'S/N'}`}
                  </Typography>
                  <Typography color="text.secondary">
                    {`${oficina.endereco.cidade} - ${oficina.endereco.estado}`}
                  </Typography>
                  <Typography color="text.secondary">
                    Telefone: {oficina.telefone}
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default WorkshopSelectionPage;