// Class to handle form responses and submissions
class FormHandler {
  /**
   * @param {SchoolEvents} schoolEvents - The main events class.
   * @param {SheetHandler} sheetHandler - The sheet handler instance.
   */
  constructor(schoolEvents, sheetHandler, rowNumber = null) {
    this.form = schoolEvents.form;
    this.sheetHandler = sheetHandler;
    this.formItemMap = {};
    // this.formResponse = this.form.createResponse(); // Removed because it is declared locally in the createAndSubmitFormResponse() method.
    this.items = this.form.getItems();
    this.testDataSheet = this.sheetHandler.testDataSheet;
    this.mapFormItems(this.items);
  }

  // Map form items for quick access
  mapFormItems(items) {
    items.forEach((item) => {
      this.formItemMap[item.getTitle()] = item;
    });
  }

// Create and submit form response
createAndSubmitFormResponse() {
  this.formResponse = this.form.createResponse();
  const testData = this.testDataSheet.getDataRange().getDisplayValues();
  const headerRow = testData[0];
  const lastRow = testData[testData.length - 1];

  for (let i = 0; i < headerRow.length; i++) {
    const header = headerRow[i];
    const value = lastRow[i];
    const item = this.formItemMap[header];
    if (item) {
      this.addItemResponse(item, value);
    }
  }

  this.formResponse.submit();
}

  // Add item response based on item type
  addItemResponse(item, value) {
    switch (item.getType()) {
      case FormApp.ItemType.TEXT:
        this.formResponse.withItemResponse(
          item.asTextItem().createResponse(value)
        );
        break;
      case FormApp.ItemType.PARAGRAPH_TEXT:
        this.formResponse.withItemResponse(
          item.asParagraphTextItem().createResponse(value)
        );
        break;
      case FormApp.ItemType.MULTIPLE_CHOICE:
        this.formResponse.withItemResponse(
          item.asMultipleChoiceItem().createResponse(value)
        );
        break;
      case FormApp.ItemType.CHECKBOX:
        const values = value.split(",").map((v) => v.trim());
        this.formResponse.withItemResponse(
          item.asCheckboxItem().createResponse(values)
        );
        break;
      case FormApp.ItemType.DATE:
        const date = new Date(value);
        this.formResponse.withItemResponse(
          item.asDateItem().createResponse(date)
        );
        break;
      case FormApp.ItemType.TIME:
        const [hours, minutes] = value.split(":").map(Number);
        this.formResponse.withItemResponse(
          item.asTimeItem().createResponse(hours, minutes)
        );
        break;
      // Handle other item types as needed
      default:
        break;
    }
  }
}
