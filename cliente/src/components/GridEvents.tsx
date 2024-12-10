import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { OpenEvent } from '../web3/web3Utils';
import AddIcon from '@mui/icons-material/Add';

interface GridEventsProps {
  eventsData: { events: OpenEvent[] };
}

function GridEvents({ eventsData }: GridEventsProps) {
  return (
    <Grid
      container
      spacing={2}
      sx={{ padding: 2 }}
      alignItems="left"
      justifyItems="center"
    >
      {eventsData.events &&
        eventsData.events.map((event, index) => (
          <Grid size={3} key={index}>
            <Card sx={{ minWidth: 250, maxWidth: 350, borderRadius: '16px' }}>
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
                  Cara ou Coroa
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                  Total Cara: {event.totalFor} ETH
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                  Total Coroa: {event.totalAgainst} ETH
                </Typography>
              </CardContent>
              <CardActions>
                <Button disabled={event.closed} color="secondary" size="small">
                  Apostar
                </Button>
                <Button disabled={event.closed} color="warning" size="small">
                  Encerrar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      <Grid size={3}>
        <Card
          sx={{
            minWidth: 250,
            maxWidth: 350,
            borderRadius: '16px',
            height: '100%',
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
  );
}

export default GridEvents;
