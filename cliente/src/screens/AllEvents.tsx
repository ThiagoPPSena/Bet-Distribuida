import GridEvents from '../components/GridEvents';
import web3Utils, { OpenEvent } from '../web3/web3Utils';
import { useEffect, useState } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useEventsTrigger } from '../contexts/TriggerEvents';

function AllEvents() {
  const { account } = useAccount();
  const [eventsData, setEventsData] = useState<{ events: OpenEvent[] }>(
    {} as { events: OpenEvent[] }
  );
  const { eventsTriggerUpdate } = useEventsTrigger();

  useEffect(() => {
    const getAllEvents = async () => {
      const events = await web3Utils.getOpenEvents();
      if (events instanceof Error) {
        return setEventsData({ events: [] });
      } else {
        setEventsData(events);
      }
    };
    void getAllEvents();
  }, [account, eventsTriggerUpdate]);

  return (
    <>
      <GridEvents eventsData={eventsData} />
    </>
  );
}

export default AllEvents;
