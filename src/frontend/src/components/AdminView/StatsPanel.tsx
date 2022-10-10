import { Chip } from "@mui/material";
import DataSaverOffIcon from "@mui/icons-material/DataSaverOff";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { RestContext } from "../../App";
import { useContext, useEffect, useState } from "react";

export interface StatsPanelProps {
  userName: string;
}

function StatsPanel({ userName }: StatsPanelProps) {
  const { apiManager } = useContext(RestContext);
  const [stats, setStats] = useState({
    avg: 0,
    lastSevenDays: 0,
    theWeekBefore: 0,
  });
  useEffect(() => {
    const controller = new AbortController();
    const fetchStats = () => {
      apiManager
        ?.get<any>(`stats/${userName}`, controller.signal)
        .then((stats) => {
          setStats({
            avg: stats.averageCaloriesForSevenDays,
            lastSevenDays: stats.addedEntriesForSevenDays,
            theWeekBefore: stats.addedEntriesPrevWeek,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchStats();
    const interval = setInterval(() => fetchStats(), 1000); // TODO: pushing data from server would be better!
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [apiManager, userName]);
  return (
    <>
      <Chip icon={<DataSaverOffIcon />} label={`avg cal:${stats.avg}`} />
      <Chip
        icon={<RestaurantIcon />}
        label={`last 7 days:${stats.lastSevenDays}/${stats.theWeekBefore}:the week before`}
      />
    </>
  );
}

export default StatsPanel;
