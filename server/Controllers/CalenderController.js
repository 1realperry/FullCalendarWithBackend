const router = require("express").Router();
const Event = require("../Models/Event");
const moment = require("moment");

// Create a new event
router.post("/create-event", async (req, res) => {
  try {
    // Create an instance of the Event model using the request body
    const event = new Event(req.body);
    // Save the event to the database
    await event.save();
    // Send a success status code
    res.sendStatus(201);
  } catch (error) {
    // Log the error to the console
    console.error("Error creating event:", error);
    // Send an internal server error status code
    res.sendStatus(500);
  }
});

// Get events within a specified date range
router.get("/get-events", async (req, res) => {
  try {
    // Validate date queries before converting
    if (!req.query.start || !req.query.end) {
      return res
        .status(400)
        .send("Start and end date query parameters are required.");
    }

    // Convert query parameters to dates using moment
    const start = moment(req.query.start).toDate();
    const end = moment(req.query.end).toDate();

    // Fetch events from the database within the specified date range
    const events = await Event.find({
      start: { $gte: start },
      end: { $lte: end },
    });

    // Send the fetched events
    res.send(events);
  } catch (error) {
    // Log the error to the console
    console.error("Error fetching events:", error);
    // Send an internal server error status code
    res.sendStatus(500);
  }
});

module.exports = router;
