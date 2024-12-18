// Main Class to manage the event process
class EventManager {
  constructor(rowNumber = null) {
    Logger.log('Initializing EventManager with row number: ' + rowNumber);

    this.schoolEvents = new SchoolEvents();
    this.sheetHandler = new SheetHandler(this.schoolEvents, rowNumber);
    this.docHandler = new DocHandler(this.schoolEvents, this.sheetHandler);
    this.calendarHandler = new CalendarHandler(
      this.schoolEvents,
      this.sheetHandler,
      this.docHandler
    );
    this.formHandler = new FormHandler(this.schoolEvents, this.sheetHandler);
    this.spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  createEvent() {
    try {
      // Fetch data from the sheet
      const eventData = this.sheetHandler.fetchData();
      const eventTitle = eventData["Formatted Event Title"];
      const eventDate = new Date(eventData["Event Date"]);
      
      // Check whether the document already exists, and if so, delete it
      this.docHandler.deleteDocument(eventTitle);
      
      // Check whether the event (setup event, main event, and cleanup event) already exists, and if so, delete
      this.calendarHandler.deleteCalendarEvent('Setup for ' + eventTitle, eventDate);

      this.calendarHandler.deleteCalendarEvent(eventTitle, eventDate);

      this.calendarHandler.deleteCalendarEvent('Cleanup for ' + eventTitle, eventDate);

      // Create new versions of the document and calendar events      
      this.docHandler.createDocument();
      this.calendarHandler.createCalendarEvents();
      this.sheetHandler.updateSheetWithDocLink(
        this.docHandler.getDocLinkForSheet()
      );
    } catch (error) {
      Logger.log(`Error creating event: ${error.stack}`);
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        `Error creating event: ${error.message}`,
      ui.ButtonSet.OK
    )

    }
  }
}

// Class to handle connections to Google services
class SchoolEvents {
  constructor() {
    // Initialize connections
    this.spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    this.form = FormApp.openById(FORM_ID);
    this.calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    this.drive = DriveApp;
    this.mail = GmailApp;
  }
}
