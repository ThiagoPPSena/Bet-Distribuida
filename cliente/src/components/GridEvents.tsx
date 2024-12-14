import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import web3Utils, { OpenEvent } from '../web3/web3Utils';
import AddIcon from '@mui/icons-material/Add';
import CoinFlipModal from './CoinFlipModal';
import { useState } from 'react';
import { useAccount } from '../contexts/AccountContext';
import CreateModal from './CreateModal';
import { useBalanceTrigger } from '../contexts/TriggerBalance';
import { useEventsTrigger } from '../contexts/TriggerEvents';

interface GridEventsProps {
  eventsData: { events: OpenEvent[] };
}

function GridEvents({ eventsData }: GridEventsProps) {
  const { account } = useAccount();

  const [openModalChoice, setOpenModalChoice] = useState<boolean>(false);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<OpenEvent>(
    {} as OpenEvent
  );

  const { triggerUpdate } = useBalanceTrigger();
  const { eventsTriggerUpdate } = useEventsTrigger();

  const handleBetChoice = (event: OpenEvent) => {
    setSelectedEvent(event);
    setOpenModalChoice(!openModalChoice);
  };

  const handleCreateEvent = () => {
    setOpenModalCreate(!openModalCreate);
  };

  // Estado para ativar o snackbar de sucesso ou erro
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleBetConfirm = (betChoice: number, value: string) => {
    void web3Utils
      .betEvent(selectedEvent.eventId, betChoice, value, account)
      .then((res) => {
        if (res instanceof Error) {
          setSnackbar({
            open: true,
            message: res.message,
            severity: 'error',
          });
        } else {
          setSnackbar({
            open: true,
            message: res.message,
            severity: 'success',
          });
          triggerUpdate();
          eventsTriggerUpdate();
        }
      });
  };

  const handleEventClose = (eventId: string) => {
    void web3Utils.closeEvent(eventId, account).then((res) => {
      if (res instanceof Error) {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'error',
        });
      } else {
        setSnackbar({
          open: true,
          message: res.message,
          severity: 'success',
        });
        triggerUpdate();
        eventsTriggerUpdate();
      }
    });
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
      <CreateModal
        setSnackbar={setSnackbar}
        open={openModalCreate}
        onClose={() => setOpenModalCreate(!openModalCreate)}
      />
      <CoinFlipModal
        title={selectedEvent.name}
        open={openModalChoice}
        onClose={() => setOpenModalChoice(!openModalChoice)}
        onConfirm={(betChoice: number, value: string) => {
          handleBetConfirm(betChoice, value);
        }}
      />
      <Grid
        container
        spacing={2}
        sx={{ padding: 2 }}
        alignItems="stretch" /* Garante que todos os itens tenham a mesma altura */
        justifyContent="flex-start"
      >
        {eventsData.events &&
          eventsData.events.map((event, index) => (
            <Grid size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }} key={index}>
              <Card
                sx={{
                  minWidth: 250,
                  maxWidth: 350,
                  minHeight: 250,
                  maxHeight: 350,
                  borderRadius: '16px',
                }}
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{ color: 'text.secondary', fontSize: 14 }}
                  >
                    Aposta {event.closed ? 'fechada' : 'aberta'}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {event.name}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                    {event.closed
                      ? event.result === '1'
                        ? 'Resultado: A favor'
                        : 'Resultado: Contra'
                      : 'A favor ou Contra'}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      mb: 1.5,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Total A favor: {event.totalFor} ETH
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      mb: 1.5,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Total Contra: {event.totalAgainst} ETH
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    disabled={event.closed}
                    color="warning"
                    size="small"
                    onClick={() => handleEventClose(event.eventId)}
                  >
                    Encerrar
                  </Button>
                  <Button
                    disabled={event.closed}
                    color="primary"
                    size="small"
                    onClick={() => handleBetChoice(event)}
                  >
                    Apostar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        <Grid size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
          <Card
            onClick={() => handleCreateEvent()}
            sx={{
              minWidth: 250,
              maxWidth: 350,
              borderRadius: '16px',
              minHeight: 250,
              maxHeight: 350,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.3s, box-shadow 0.3s',
              '&:hover': {
                backgroundColor: '#5A157F',
                '& .MuiSvgIcon-root': {
                  // Aqui estamos afetando o ícone dentro do Card
                  color: 'white', // Mudando a cor do ícone ao passar o mouse sobre o Card
                },
              },
            }}
          >
            <CardActions sx={{ textAlign: 'center' }}>
              <AddIcon sx={{ color: '#5A157F', fontSize: 100 }} />
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default GridEvents;
