// Class to handle Google Sheet interactions
class SheetHandler {
  /**
   * @param {SchoolEvents} schoolEvents - The main events class.
   * @param {number|null} rowNumber - The row number to process.
   */
  constructor(schoolEvents, rowNumber = null) {
    this.sheet = schoolEvents.spreadsheet.getSheetByName("Form Responses");

    // Add test data sheet to be used by the form handler for test submissions
    this.testDataSheet = schoolEvents.spreadsheet.getSheetByName("Test Form Data Source");
    
    this.responseRow = rowNumber || this.sheet.getLastRow();
    this.headerValues = [];
    this.responseValues = [];
    this.headerIndexMap = {};
    this.data = {};
  }

  // Fetch data from the sheet and map headers to values
  fetchData() {
    const lastColumn = this.sheet.getLastColumn();
    this.headerValues = this.sheet
      .getRange(1, 1, 1, lastColumn)
      .getDisplayValues()[0];
    this.responseValues = this.sheet
      .getRange(this.responseRow, 1, 1, lastColumn)
      .getDisplayValues()[0];

    // Create header index map
    this.headerValues.forEach((header, index) => {
      this.headerIndexMap[header] = index;
    });

    // Map data
    for (const [header, index] of Object.entries(this.headerIndexMap)) {
      this.data[header] = this.responseValues[index];
    }

    // Format specific fields
    this.formatEventDate();
    this.formatEventTitle();

    return this.data;
  }

  // Get value by header name
  getValue(header) {
    const index = this.headerIndexMap[header];
    return this.responseValues[index];
  }

  // Format event date
  formatEventDate() {
    const eventDate = new Date(this.getValue("Event Date"));
    const options = { month: "long", day: "numeric" };
    this.data["Formatted Event Date"] = eventDate.toLocaleDateString(
      "en-US",
      options
    );
  }

  // Format event title
  formatEventTitle() {
    const eventTitle = this.getValue("Event Title");
    const formattedDate = this.data["Formatted Event Date"];
    this.data["Formatted Event Title"] = `${eventTitle} (${formattedDate})`;
  }

  // Update sheet with document link
  updateSheetWithDocLink(docLink) {
    const eventSummaryIndex = this.headerIndexMap["Event Summary Doc"];
    if (eventSummaryIndex !== undefined) {
      const cell = this.sheet.getRange(this.responseRow, eventSummaryIndex + 1);
      cell.setValue(docLink);
    }
  }
}
