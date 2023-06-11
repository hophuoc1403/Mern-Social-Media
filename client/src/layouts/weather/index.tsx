import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MainLayout from "../MainLayout";
import {Typography} from "@mui/material";


const events = [
  {
    id: 23,
    title: "Go to the gym",
    start: new Date(),
    end: new Date()
  }, {
    id: 14,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 60)),
    end: new Date(new Date().setHours(new Date().getHours() - 55))
  },{
    id: 23,
    title: "Go to the gym",
    start: new Date(2023, 6, 8, 18, 30, 0),
    end: new Date(2023, 3, 10, 20, 0, 0)
  },
];


moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function ReactBigCalendar() {
  const [eventsData, setEventsData] = useState<any>(events);

  const handleSelect = ({ start, end }:{ start:any, end:any }) => {
    const title = window.prompt("New Event name");
    if (title)
      setEventsData([
        ...eventsData,
        {
          start,
          end,
          title
        }
      ]);
  };
  return (
    <MainLayout >
      <Typography textAlign={"center"} variant={"h3"} mb={3}>Calendar and Events</Typography>
      <Calendar
        views={["day", "agenda", "work_week", "month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: "100vh" }}
        onSelectEvent={(event) => alert(event.title)}
        onSelectSlot={handleSelect}
      />
    </MainLayout>
  );
}
