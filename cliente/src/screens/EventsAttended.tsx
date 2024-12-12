import web3Utils, { OpenEvent } from '../web3/web3Utils';
import { useEffect, useState } from 'react';
import GridEvents from '../components/GridEvents';
import { useAccount } from '../contexts/AccountContext';
import { useEventsTrigger } from '../contexts/TriggerEvents';

function EventsAttended() {
  const { account } = useAccount();
  const [eventsData, setEventsData] = useState<{ events: OpenEvent[] }>(
    {} as { events: OpenEvent[] }
  );
  const { eventsTriggerUpdate } = useEventsTrigger();

  useEffect(() => {
    const getMyEvents = async () => {
      const events = await web3Utils.getMyBets(account);
      if (events instanceof Error) {
        return setEventsData({ events: [] });
      } else {
        setEventsData(events);
      }
    };
    void getMyEvents();
  }, [account, eventsTriggerUpdate]);

  return (
    <>
      <GridEvents eventsData={eventsData} />
    </>
  );
}

export default EventsAttended;
