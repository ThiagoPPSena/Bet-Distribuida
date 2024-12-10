import RoutesBet from "./routes/routesBet";
import { AccountProvider } from './contexts/AccountContext.tsx';
function App() {

  return (
   <>
    <AccountProvider>
      <RoutesBet />
    </AccountProvider>
   </>
  )
}

export default App
