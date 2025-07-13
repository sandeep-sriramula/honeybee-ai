// Google Apps Script for handling contact form submissions
// CLEAN VERSION - Updated January 2025

function doPost(e) {
  console.log('=== DOPOST FUNCTION STARTED ===');
  
  try {
    // Log what we received
    console.log('Request object e:', e);
    console.log('e.parameter:', e ? e.parameter : 'undefined');
    
    // Spreadsheet configuration
    const spreadsheetId = '1FE-OpK1oUC_W2-Kc3anKUMZns0dbQvwRmDqHg36vTRk';
    console.log('Opening spreadsheet:', spreadsheetId);
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getActiveSheet();
    console.log('Sheet name:', sheet.getName());
    
    // Initialize form data variables
    let name = 'NO_NAME';
    let email = 'NO_EMAIL';
    let subject = 'NO_SUBJECT';
    let message = 'NO_MESSAGE';
    
    // Extract form data ONLY from e.parameter (query string)
    if (e && e.parameter) {
      console.log('Found parameters, extracting data...');
      name = String(e.parameter.name || 'EMPTY_NAME');
      email = String(e.parameter.email || 'EMPTY_EMAIL');
      subject = String(e.parameter.subject || 'EMPTY_SUBJECT');
      message = String(e.parameter.message || 'EMPTY_MESSAGE');
      
      console.log('Extracted data:', {
        name: name,
        email: email,
        subject: subject,
        message: message
      });
    } else {
      console.log('NO PARAMETERS FOUND - using default values');
    }
    
    // Create timestamp
    const timestamp = new Date();
    console.log('Timestamp:', timestamp);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      console.log('Sheet is empty, adding headers');
      sheet.getRange(1, 1, 1, 5).setValues([
        ['Timestamp', 'Name', 'Email', 'Subject', 'Message']
      ]);
    }
    
    // Prepare row data
    const rowData = [timestamp, name, email, subject, message];
    console.log('Row data to add:', rowData);
    
    // Add the data to the sheet
    sheet.appendRow(rowData);
    console.log('SUCCESS: Data added to sheet');
    
    // Return success response
    const response = {
      success: true,
      message: 'Contact form submitted successfully!',
      data: { name, email, subject, message },
      timestamp: timestamp.toISOString()
    };
    
    console.log('Returning response:', response);
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('ERROR in doPost:', error.toString());
    console.error('Error stack:', error.stack);
    
    const errorResponse = {
      success: false,
      message: 'Server error: ' + error.toString(),
      error: error.toString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test GET request handler
function doGet(e) {
  console.log('=== DOGET FUNCTION STARTED ===');
  console.log('GET parameters:', e ? e.parameter : 'undefined');
  
  const message = 'Contact form handler is ACTIVE!\n' +
                 'Timestamp: ' + new Date().toISOString() + '\n' +
                 'Parameters received: ' + (e && e.parameter ? 'YES' : 'NO');
  
  return ContentService.createTextOutput(message);
}

// Manual test function
function testAddData() {
  console.log('=== MANUAL TEST FUNCTION ===');
  
  try {
    const spreadsheetId = '1FE-OpK1oUC_W2-Kc3anKUMZns0dbQvwRmDqHg36vTRk';
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getActiveSheet();
    
    console.log('Sheet name:', sheet.getName());
    console.log('Current rows:', sheet.getLastRow());
    
    // Add test data
    const testRow = [new Date(), 'Manual Test', 'manual@test.com', 'Test Subject', 'Manual test message'];
    sheet.appendRow(testRow);
    
    console.log('Manual test data added successfully!');
    return 'Success: Test data added to sheet';
    
  } catch (error) {
    console.error('Error in manual test:', error);
    return 'Error: ' + error.toString();
  }
}
