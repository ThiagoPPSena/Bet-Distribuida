import web3Utils, { OpenEvent } from "../web3/web3Utils";
import { useEffect, useState } from "react";
import GridEvents from "../components/GridEvents";
import { useAccount } from '../contexts/AccountContext';

function MyEvents() {
  const { account } = useAccount();
  const [eventsData, setEventsData] = useState<{ events: OpenEvent[] }>({} as { events: OpenEvent[] });

  useEffect(() => {
    const getMyEvents = async () => {
      const events = await web3Utils.getMyBets(account);
      if (events instanceof Error) {
        return;
      }
      setEventsData(events);
    }
    void getMyEvents();
  }
  , [account]);

  return (
    <>
      <GridEvents eventsData={eventsData} />
    </>
  );
}

export default MyEvents;