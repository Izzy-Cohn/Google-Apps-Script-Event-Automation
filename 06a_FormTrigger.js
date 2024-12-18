// Installable trigger to handle form submissions
function createOnFormSubmitTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  const triggerExists = triggers.some(
    (trigger) => trigger.getHandlerFunction() === "onFormSubmitHandler"
  );
  if (!triggerExists) {
    ScriptApp.newTrigger("onFormSubmitHandler")
      .forSpreadsheet(SPREADSHEET_ID)
      .onFormSubmit()
      .create();
  }
}

// Trigger handler function
function onFormSubmitHandler(e) {
  try {
    Logger.log("onFormSubmitHandler triggered");
    const eventManager = new EventManager(e.range.getRow());
    eventManager.createEvent();
  } catch (error) {
    Logger.log(`Error in onFormSubmitHandler: ${error.message}`);
  }
}