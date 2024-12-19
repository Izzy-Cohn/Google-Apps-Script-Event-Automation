# Google Apps Script: School Event Management System

## Overview

This project is a comprehensive Google Apps Script solution for managing school events. It integrates Google Sheets, Forms, Calendar, and Docs to automate event creation, approval, and documentation. The system streamlines the process of creating events, generating related documentation, and updating stakeholders.

IMPORTANT NOTES: 

- This project is designed for educational purposes and may require customization for specific use cases.
- For development and testing, I highly recommend using [clasp (Command Line Apps Script Projects)](https://developers.google.com/apps-script/guides/clasp) to manage the project files. Google Developers Codelab has a helpful tutorial for setting up and using clasp, which can be found [here](https://codelabs.developers.google.com/codelabs/clasp/#0).
- It is recommended that the file naming convention using numbers (e.g., `01_EventManager.js`) be preserved because of how the Apps Script runtime reads and executes files.

---

## Features

### 1. **Event Automation**
   - Automatically creates main, setup, and cleanup events in Google Calendar.
   - Deletes and replaces existing events to prevent duplication.

### 2. **Google Sheet Integration**
   - Processes event data submitted through a linked Google Form.
   - Formats event details and updates sheets with relevant links.

### 3. **Document Management**
   - Automatically generates Google Docs summaries for events using a pre-defined template.
   - Links the document to the corresponding Google Sheet row and Calendar event.

### 4. **Approval Workflow**
   - Includes a trigger-based approval system that allows for manual or automatic approval of form submissions.
   - Sends confirmation alerts for key actions.

### 5. **Error Handling**
   - Logs errors and alerts users in case of issues during event creation or document generation.

---

## Setup Instructions

### Prerequisites
- A Google Workspace account with access to:
  - Google Sheets
  - Google Forms
  - Google Calendar
  - Google Docs
- Apps Script runtime (V8) enabled in your project.

### Configuration
1. **Clone or copy the repository files into your Apps Script project.**
2. Update the constants in `00_Config.js`:
   ```javascript
   const SPREADSHEET_ID = "<Your Spreadsheet ID>";
   const FORM_ID = "<Your Form ID>";
   const TEMPLATE_ID = "<Your Template ID>";
   const CALENDAR_ID = "<Your Calendar ID>";
3. Deploy the necessary triggers:
   - Run `createOnFormSubmitTrigger` from `06a_FormTrigger.js` to set up a form submission trigger.
   - Run `createOnEditTrigger` from `06b_SheetTrigger.js` to enable sheet edit tracking.

### Permissions
Ensure your Apps Script project has the following OAuth scopes (defined in `appsscript.json`):
- Google Sheets, Forms, Calendar, and Docs access.
- Drive API for file management.
- Cloud Platform for logging.

---

## Key Scripts and Classes

### `01_EventManager.js`
- Main entry point for managing the event workflow. Orchestrates sheet, document, and calendar interactions.

### `02_SheetHandler.js`
- Handles Google Sheet data, including formatting and updating event details.

### `03_DocHandler.js`
- Generates Google Docs from a template with event-specific data.

### `04_CalendarHandler.js`
- Manages Google Calendar events, including creation, updates, and deletions.

### `05_FormHandler.js`
- Processes Google Form submissions and links them to events.

### `06a_FormTrigger.js` and `06b_SheetTrigger.js`
- Defines triggers for form submissions and sheet edits.

### `07_TestFunctions.js`
- Includes test functions for debugging and validation during development.

---

## Testing

1. Use the test functions in `07_TestFunctions.js` to simulate form submissions and event creation.
2. Verify the creation of:
   - Calendar events.
   - Google Docs with correct formatting.
   - Links and updates in the Google Sheet.

---

## Future Enhancements

- Integration with email notifications.
- Support for recurring events.
- Advanced error tracking with external logging tools.
