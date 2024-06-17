import React, { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AddEventModal from "./AddEventModal";
import axios from "axios";
import moment from "moment";

export default function CalendarComponent() {
  const [modalOpen, setModalOpen] = useState(false);
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);

  // Fetch events from the server when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/calendar/get-events", {
        params: {
          start: moment().startOf("month").toISOString(),
          end: moment().endOf("month").toISOString(),
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const onEventAdded = async (event) => {
    try {
      console.log("Event added:", event); // Debugging
      await axios.post("/api/calendar/create-event", event);
      fetchEvents(); // Refresh events after adding a new event
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleDateSet = async (data) => {
    try {
      console.log("Date range for events:", data); // Debugging
      const response = await axios.get("/api/calendar/get-events", {
        params: {
          start: moment(data.start).toISOString(),
          end: moment(data.end).toISOString(),
        },
      });
      console.log("Events fetched from server:", response.data); // Debugging
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <section>
      <button onClick={() => setModalOpen(true)}>Add Event</button>

      <div style={{ position: "relative", zIndex: 0 }}>
        <FullCalendar
          ref={calendarRef}
          events={events}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "today prev,next",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="90vh"
          eventAdd={(event) => onEventAdded(event.event)}
          datesSet={(date) => handleDateSet(date)}
        />
      </div>

      <AddEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEventAdded={(event) => onEventAdded(event)}
      />
    </section>
  );
}
