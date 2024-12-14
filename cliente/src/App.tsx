import RoutesBet from './routes/routesBet';
import { AccountProvider } from './contexts/AccountContext.tsx';
import { BalanceTriggerProvider } from './contexts/TriggerBalance.tsx';
import { EventsTriggerProvider } from './contexts/TriggerEvents.tsx';
function App() {
  return (
    <>
      <AccountProvider>
        <BalanceTriggerProvider>
          <EventsTriggerProvider>
            <RoutesBet />
          </EventsTriggerProvider>
        </BalanceTriggerProvider>
      </AccountProvider>
    </>
  );
}

export default App;
