// Class to handle calendar events
class CalendarHandler {
  /**
   * @param {SchoolEvents} schoolEvents - The main events class.
   * @param {SheetHandler} sheetHandler - The sheet handler instance.
   * @param {DocHandler} docHandler - The document handler instance.
   */
  constructor(schoolEvents, sheetHandler, docHandler) {
    this.calendar = schoolEvents.calendar;
    this.sheetHandler = sheetHandler;
    this.docHandler = docHandler;
    
    // The following three variables are initialized as null and are meant to be assigned the three event objects once created by the createCalendarEvents() method. Because the execution is complete once the events are created, these variables are not currently referenced in the code. For example, they can't be used by the deleteCalendarEvent() method because they are not assigned until the createCalendarEvents() method is called, which is why the deletion logic uses data from the google sheet to check for existing events. However, these may be useful in the future if the code is expanded to include additional functionality. 
    this.mainEvent;
    this.setupEvent;
    this.cleanupEvent;
  }  

  // Delete calendar event by title and date
  deleteCalendarEvent(title, date) {
    const events = this.calendar.getEventsForDay(date);
    Logger.log(`Events for ${date}:`);
    
    // Loop through events and delete the event if the title matches
    for (const event of events) {
      if (event.getTitle() === title &&
        this.compareDates(event, date) === true) {
        event.deleteEvent();
        Logger.log('Event deleted: ' + title);
        return;
      }
    }

    // Log a message if the event is not found
    Logger.log('Event not found: ' + title + ', deletion skipped.');
  }

  // Create calendar events
  createCalendarEvents() {

    // Get data from the sheet
    const data = this.sheetHandler.data;
    const eventTitle = data["Formatted Event Title"];

    // Create dates for main event
    const eventStartDate = new Date(
      `${data["Event Date"]} ${data["Event Start Time"]}`
    );
    const eventEndDate = new Date(
      `${data["Event Date"]} ${data["Event End Time"]}`
    );

    // Create dates for setup event
    const setupStartDate = new Date(
      `${data["Event Date"]} ${data["Setup Start Time"]}`
    );
    const setupEndDate = new Date(
      `${data["Event Date"]} ${data["Event Start Time"]}`
    ); // Setup ends when the event starts, by default

    // Create dates for cleanup event
    const cleanupStartDate = new Date(
      `${data["Event Date"]} ${data["Event End Time"]}`
    ); // Cleanup starts when the event ends, by default

    const cleanupEndDate = new Date(eventEndDate.getTime() + 30 * 60000);// Cleanup ends 30 minutes after the event ends, by default
    
    
    const location = data["Location"];
    const description = this.docHandler.getDocLinkForCalendar();

    // Create main event. See comment in the constructor about the variables for the three event objects.
    this.mainEvent = this.calendar.createEvent(
      eventTitle,
      eventStartDate,
      eventEndDate,
      {
        location: location,
        description: description,
      }
    );

    // Create setup event. See comment in the constructor about the variables for the three event objects.
    this.setupEvent = this.calendar.createEvent(
      `Setup for ${eventTitle}`,
      setupStartDate,
      setupEndDate,
      {
        location: location,
        description: description,
      }
    );

    // Create cleanup event. See comment in the constructor about the variables for the three event objects.
    this.cleanupEvent = this.calendar.createEvent(
      `Cleanup for ${eventTitle}`,
      cleanupStartDate,
      cleanupEndDate,
      {
        location: location,
        description: description,
      }
    );
  }

  // Function for comparing a calender event date with a target date object (e.g., a `Date` object representing the date of an event from the Google Sheet)

  compareDates(calendarEvent, targetDate) {
    var eventDate = calendarEvent.getStartTime();

    var eventDateObject = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    var targetDateObject = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
    if (eventDateObject.getTime() === targetDateObject.getTime()) {
      Logger.log('The dates match');
      return true;
    } else {
      Logger.log('The dates do not match');
      return false;
    }
  }

}
