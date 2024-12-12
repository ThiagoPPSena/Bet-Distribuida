import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  InputAdornment,
} from '@mui/material';

interface CoinFlipModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (betChoice: number, value: string) => void;
}

const CoinFlipModal = ({
  title,
  open,
  onClose,
  onConfirm,
}: CoinFlipModalProps) => {
  const [betChoice, setBetChoice] = useState<number>(1);
  const [betValue, setBetValue] = useState<string>('');

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBetValue(event.target.value);
  };

  const handleBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBetChoice(Number(event.target.value));
  };

  const handleConfirm = () => {
    onConfirm(betChoice, betValue);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="coin-flip-modal-title"
      aria-describedby="coin-flip-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 350,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="coin-flip-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box>
            <FormControl>
              <RadioGroup
                value={betChoice}
                onChange={handleBetChange}
                name="coin-bet-options"
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="A favor"
                />
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Contra"
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box
            sx={{
              width: '10em',
            }}
          >
            <TextField
              id="bet-value"
              label="Valor"
              variant="outlined"
              value={betValue}
              onChange={handleValueChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">ETH</InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'right' }}>
          <Button variant="outlined" color="warning" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CoinFlipModal;
