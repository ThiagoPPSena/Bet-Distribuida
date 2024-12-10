import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";

const CoinFlipModal = ({ open, onClose, onConfirm }) => {
  const [betChoice, setBetChoice] = useState("cara");

  const handleBetChange = (event) => {
    setBetChoice(event.target.value);
  };

  const handleConfirm = () => {
    onConfirm(betChoice);
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
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="coin-flip-modal-title" variant="h6" component="h2" gutterBottom>
          Apostar em Cara ou Coroa
        </Typography>
        <FormControl>
          <RadioGroup
            value={betChoice}
            onChange={handleBetChange}
            name="coin-bet-options"
          >
            <FormControlLabel value="cara" control={<Radio />} label="Cara" />
            <FormControlLabel value="coroa" control={<Radio />} label="Coroa" />
          </RadioGroup>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
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
