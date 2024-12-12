import {
  Modal,
  Box,
  Typography,
  Fade,
  Backdrop,
  TextField,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs'; // Garantindo que dayjs esteja importado corretamente
import { useAccount } from '../contexts/AccountContext';
import web3Utils from '../web3/web3Utils';
import { useEventsTrigger } from '../contexts/TriggerEvents';

// Estilo do modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Interface para as props do modal
interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: 'success' | 'error';
    }>
  >;
}

function CreateModal({ open, onClose, setSnackbar }: CreateModalProps) {
  const { account } = useAccount();

  // Estado para armazenar o valor do input
  const [inputValue, setInputValue] = useState('');
  // Estado para armazenar a data de encerramento selecionada
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const { eventsTriggerUpdate } = useEventsTrigger();

  // Função para lidar com a mudança no input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Função para lidar com a mudança na data
  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
  };

  // Função para submeter o valor do input e a data
  const handleSubmit = () => {
    const endTimestamp = selectedDate?.unix();
    console.log('Timestamp de encerramento:', endTimestamp); // Exibe o timestamp no console
    if (typeof endTimestamp !== 'number' || isNaN(endTimestamp)) {
      return;
    }
    void web3Utils
      .createEvent(inputValue, String(endTimestamp), account)
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
          eventsTriggerUpdate();
        }
      });

    setInputValue(''); // Limpa o input após o envio
    setSelectedDate(null); // Limpa a data após o envio
    onClose(); // Fecha o modal após a submissão
  };

  // Função para lidar com o fechamento do modal
  const handleModalClose = () => {
    setInputValue(''); // Limpa o valor do input ao fechar o modal
    setSelectedDate(null); // Limpa a data ao fechar o modal
    onClose(); // Fecha o modal
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleModalClose} // Fecha e limpa o input ao fechar
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Digite o nome do evento
          </Typography>

          {/* Campo de texto para o nome do evento */}
          <TextField
            id="outlined-basic"
            label="Nome"
            value={inputValue} // Vincula o valor do input ao estado
            onChange={handleInputChange} // Atualiza o estado ao mudar o input
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }} // Adiciona um espaçamento entre o campo e o botão
          />

          {/* Seleção de data de encerramento */}
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Selecione a data de encerramento
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Data de encerramento"
              value={selectedDate} // Vincula o valor do DatePicker ao estado
              onChange={handleDateChange} // Atualiza o estado ao selecionar a data
            />
          </LocalizationProvider>

          {/* Botão para submeter o valor do input */}
          <Button
            onClick={handleSubmit}
            disabled={inputValue.trim() === '' || !selectedDate} // Desabilita o botão se o input ou a data estiverem vazios
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Enviar
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}

export default CreateModal;
