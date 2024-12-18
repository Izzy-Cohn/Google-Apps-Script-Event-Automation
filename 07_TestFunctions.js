function submitTestFormResponse() {
    const eventManager = new EventManager();
    eventManager.formHandler.createAndSubmitFormResponse();
  }
  
  
// Function to manually test the event creation
function testCreateEvent() {
  const eventManager = new EventManager(9);
  eventManager.createEvent();
}

// Function to manually test the myOnEdit function
function testMyOnEdit() {
  myOnEdit(9);
}