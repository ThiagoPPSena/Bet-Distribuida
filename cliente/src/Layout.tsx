import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import web3Utils from './web3/web3Utils';
import { Link, Outlet } from 'react-router-dom';
import { Wallet } from '@mui/icons-material';
import { useAccount } from './contexts/AccountContext';
import { useBalanceTrigger } from './contexts/TriggerBalance';

function Layout() {
  const { account, setAccount } = useAccount();
  const [accounts, setAccounts] = useState<string[]>([]);
  const [balanceEth, setBalanceEth] = useState<string>('');
  const { triggerUpdate } = useBalanceTrigger();

  useEffect(() => {
    const getBalance = async () => {
      const balance = await web3Utils.getBalance(account);
      if (balance instanceof Error) {
        console.log(balance.message);
        return;
      }
      const formattedBalance = parseFloat(balance).toFixed(3);
      setBalanceEth(formattedBalance);
    };
    if (account) {
      void getBalance();
    }
  }, [account, triggerUpdate]); // Dependência account para executar sempre que account mudar

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Utils.getGanacheAccounts();
      if (accounts instanceof Error) {
        console.log(accounts.message);
        return;
      }
      setAccounts(accounts);
      setAccount(accounts[0]);
    };

    void getAccounts();
  }, [setAccount]); // Dependência setAccount para executar sempre que setAccount mudar

  const handleChange = (event: SelectChangeEvent<string>) => {
    setAccount(event.target.value);
  };

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{
        width: '10em',
        height: '100vh',
        backgroundColor: '#5A157F',
        color: 'white',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        <ListItem key={'Home'} disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary={'Home'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'Meus Eventos'} disablePadding>
          <ListItemButton component={Link} to="/myEvents">
            <ListItemText primary={'Meus Eventos'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'Minhas apostas'} disablePadding>
          <ListItemButton component={Link} to="/myParticipations">
            <ListItemText primary={'Minhas Apostas'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <AppBar
        position="static"
        sx={{ backgroundColor: '#5A157F' }}
        elevation={0}
      >
        <Toolbar>
          {/* Ícone de menu */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Título ou logo */}
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1, ml: 1 }}>
            Bet Distribuída
          </Typography>

          {/* Botões de navegação */}
          <Typography
            variant="h6"
            color="inherit"
            sx={{
              pr: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Wallet sx={{ mr: 1 }} />
            {balanceEth} ETH
          </Typography>
          <Select
            value={account}
            onChange={handleChange}
            size="small"
            sx={{
              width: '8em',
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '& .MuiSelect-icon': {
                color: 'white', // Cor do ícone de dropdown
              },
            }}
          >
            {accounts.map((account, index) => (
              <MenuItem key={index} value={account}>
                {`Conta ${index + 1}`}{' '}
              </MenuItem>
            ))}
          </Select>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      {/* Espaço para as rotas filhas */}

      <Box
        component="main"
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#343236',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '10px',
            background: '#5A157F',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#5A157F',
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
