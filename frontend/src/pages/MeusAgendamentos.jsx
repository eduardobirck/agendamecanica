import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { Box, Typography, CircularProgress, Alert, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

function MeusAgendamentos() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeusAgendamentos = useCallback(async () => {
    try {
      const response = await api.get('/agendamentos/meus');
      setBookings(response.data);
    } catch (err) {
      setError('Não foi possível carregar seus agendamentos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeusAgendamentos();
  }, [fetchMeusAgendamentos]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Meus Agendamentos
      </Typography>
      
      {bookings.length === 0 ? (
        <Typography>Você ainda não possui agendamentos.</Typography>
      ) : (
        <Paper>
          <List>
            {bookings.map((booking, index) => (
              <React.Fragment key={booking._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Serviço: ${booking.servico?.nome || 'Não especificado'}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Oficina: {booking.oficina?.nome || 'Não especificada'}
                        </Typography>
                        <br />
                        Data: {new Date(booking.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às {booking.hora}
                      </>
                    }
                  />
                </ListItem>
                {index < bookings.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default MeusAgendamentos;