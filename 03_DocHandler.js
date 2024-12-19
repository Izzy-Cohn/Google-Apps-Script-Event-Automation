class DocHandler {
  /**
   * @param {SchoolEvents} schoolEvents - The main events class.
   * @param {SheetHandler} sheetHandler - The sheet handler instance.
   */
  constructor(schoolEvents, sheetHandler) {
    this.schoolEvents = schoolEvents;
    this.sheetHandler = sheetHandler;
    this.templateId = TEMPLATE_ID;
    this.doc = null;
  }

  // Delete a document by name
  deleteDocument(docName) {
    // Get the list of files with the specified name
    let files = this.schoolEvents.drive.getFilesByName(docName);

    // If a file with the specified name exists, delete it
    while (files.hasNext()) {
      let file = files.next();
      if (file.getName() === docName) {
        file.setTrashed(true);
        Logger.log('Deleted file: ' + docName);
        return;
      }
    }

    // If no file with the specified name exists, log a message
    Logger.log('Doc not found: ' + docName + ', deletion skipped.');
  };


  // Create a new document based on the template
  createDocument() {
    const templateFile = this.schoolEvents.drive.getFileById(this.templateId);
    const eventTitle = this.sheetHandler.data["Formatted Event Title"];
    const newFile = templateFile.makeCopy(eventTitle);
    this.doc = DocumentApp.openById(newFile.getId());
    const body = this.doc.getBody();

    // Generate content
    const content = this.generateContent();

    // Clear the body and create a table
    body.clear();
    const table = body.appendTable(content);

    // Remove table borders if desired
    table.setBorderWidth(0);

    // Format table rows and cells
    for (let i = 0; i < table.getNumRows(); i++) {
      const row = table.getRow(i);
      const bgColor = (i % 2 === 0) ? '#7a98c2' : '#ffffff';
      for (let j = 0; j < row.getNumCells(); j++) {
        const cell = row.getCell(j);
        cell.setFontSize(10).setFontFamily('Calibri');
        cell.setBackgroundColor(bgColor);
      }
    }
  }

  // Generate content for the document
  generateContent() {
    const data = this.sheetHandler.data;
    const content = [];
    for (const header of this.sheetHandler.headerValues) {
      const value = data[header];
      content.push([header, value]);
    }
    return content;
  }

  // Get document link for sheet insertion
  getDocLinkForSheet() {
    if (this.doc) {
      const docUrl = this.doc.getUrl();
      return `=HYPERLINK("${docUrl}", "Link to Google Doc")`;
    }
    return "";
  }

  // Get document link for calendar event
  getDocLinkForCalendar() {
    if (this.doc) {
      return this.doc.getUrl();
    }
    return "";
  }
}
