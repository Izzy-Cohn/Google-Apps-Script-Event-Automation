//--Installable Triggers--//


// Triggers the callback function myOnEdit(e) when the Google Sheet is edited; when the edit e occurs, the .onEdit() method of the TriggerBuilder below passes an e object to the `e` parameter in the myOnEdit(e) callback function;

function createOnEditTrigger() {

/*
The line below checks if the trigger already exists so as to prevent accidentally creating multiple triggers for the same function.
If you run the createOnEditTrigger() function multiple times without checking for the existence of the trigger, it will create multiple triggers for the myOnEdit function. As a result, the myOnEdit function will be executed multiple times for each edit in the Google Sheet, which might lead to unexpected behavior or performance issues.
By first checking if the trigger already exists, you can avoid creating duplicate triggers. If a trigger with the handler function 'myOnEdit' is found, the script will not create a new trigger, ensuring that only one trigger exists for the function. If no such trigger is found, the script will proceed to create a new trigger.
*/
  const script = ScriptApp.getProjectTriggers().find(trigger => trigger.getHandlerFunction() === 'myOnEdit');
  if (!script) {
    ScriptApp.newTrigger('myOnEdit')
      .forSpreadsheet(SPREADSHEET_ID)
      .onEdit()
      .create();
  }
}


//--Trigger Callback Functions--//

// This function takes the e object created by the TriggerBuilder .onEdit() method in the createOnEditTrigger() function above and tests it for various conditions, then performs the applicable action.

function myOnEdit(e) {
  Logger.log("myOnEdit(e) triggered");

  const eRow = e.range.getRow();
  Logger.log(`Edited row: ${eRow}`);
  
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName('Form Responses');
  const sheetName = sheet.getName();
  const checkboxColumn = 1;

  const eventCheckboxValue = sheet.getSheetValues(eRow, checkboxColumn, 1, 1)[0][0];
  Logger.log(`Checkbox value: ${eventCheckboxValue}`);
 

  // Check if the edited cell is the one with the checkbox and if the checkbox is checked
  if (
    e.range.getSheet().getName() === sheetName &&
    e.range.getColumn() === checkboxColumn &&
    e.value === 'TRUE'
  ) {
    // Display the dialog box
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'You are about to approve this Form response and create a Calendar event. If the event already exists it will be deleted and replaced, along with its corresponding event summary Google Doc. Are you sure you want to proceed?',
      ui.ButtonSet.YES_NO
    );
   
    if (response === ui.Button.YES) {
      
      const eventManager = new EventManager(eRow); // creates a new object of the Event Manager class, which instantiates all the other classes; Uses the event row as the response row for the sheetHandler properties and methods (as opposed to the default last row);

      eventManager.createEvent(); // calls the createEvent method of the EventManager class, which deletes any existing documents and events with that name, creates the new document and event, and updates the Google Sheet with the event details;

    } else {
      // Put the action you want to perform when the user clicks "No" here
      ui.alert('Action canceled.');
      
      // Uncheck the checkbox
      e.range.setValue(false);
    }
  }

  // // Check if any other cell is edited while the Approval checkbox is checked
  
  if (
    e.range.getSheet().getName() === sheetName &&
    e.range.getColumn() !== checkboxColumn &&
    eventCheckboxValue === true
  ) {
    // Display the dialog box
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      'You are editing a Form response that has already been approved. Your changes will not be reflected in the Calendar event unless you re-approve it.',
      ui.ButtonSet.OK
    )
  };
}