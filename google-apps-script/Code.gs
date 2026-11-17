var LAGOS_TIMEZONE = 'Africa/Lagos';
var MAX_CELL_LENGTH = 1000;

var FORM_TABS = {
  inspection: {
    tabName: 'Inspection Requests',
    headers: [
      'Reference',
      'Date',
      'Full Name',
      'Phone Number',
      'WhatsApp Number',
      'Email',
      'Preferred Contact Method',
      'Property or Project of Interest',
      'Preferred Inspection Date',
      'Alternative Date',
      'Preferred Time',
      'Number of Attendees',
      'Questions or Comments',
      'Status'
    ]
  },
  purchase: {
    tabName: 'Purchase Enquiries',
    headers: [
      'Reference',
      'Date',
      'Full Name',
      'Phone Number',
      'WhatsApp Number',
      'Email',
      'Preferred Contact Method',
      'Property Category',
      'Selected Property / Reference',
      'Preferred Location',
      'Residential Address',
      'Preferred House Type',
      'Bedroom Preference',
      'Intended Use',
      'Purchase Timeline',
      'Preferred Inspection Date',
      'Payment Preference',
      'Budget',
      'Additional Questions'
    ]
  },
  rental: {
    tabName: 'Rental Enquiries',
    headers: [
      'Reference',
      'Date',
      'Full Name',
      'Phone Number',
      'WhatsApp Number',
      'Email',
      'Preferred Contact Method',
      'Rental Category',
      'Preferred Rental Duration',
      'Preferred Location',
      'Budget Range',
      'Property Reference',
      'Accommodation Type',
      'Number of Bedrooms',
      'Number of Occupants',
      'Check-In Date',
      'Check-Out Date',
      'Preferred Move-In Date',
      'Additional Requests'
    ]
  },
  land: {
    tabName: 'Land Enquiries',
    headers: [
      'Reference',
      'Date',
      'Full Name',
      'Phone Number',
      'WhatsApp Number',
      'Email',
      'Preferred Contact Method',
      'Selected Property / Project',
      'Preferred Location',
      'Residential Address',
      'Preferred Plot Size',
      'Plot Quantity',
      'Intended Land Use',
      'Intended Use',
      'Purchase Timeline',
      'Preferred Inspection Date',
      'Payment Preference',
      'Budget',
      'Additional Questions'
    ]
  },
  custom: {
    tabName: 'Custom Requests',
    headers: [
      'Reference',
      'Date',
      'Full Name',
      'Phone Number',
      'WhatsApp Number',
      'Email',
      'Preferred Contact Method',
      'Property Category',
      'Preferred Location',
      'Budget Range',
      'House / Apartment Type or Land Size',
      'Bedroom Requirement',
      'Requested Rental Duration',
      'Intended Use',
      'Expected Timeline',
      'Additional Description'
    ]
  }
};

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var keys = ['inspection', 'purchase', 'rental', 'land', 'custom'];

  for (var i = 0; i < keys.length; i++) {
    ensureTab(ss, FORM_TABS[keys[i]]);
  }

  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    if (defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0) {
      ss.deleteSheet(defaultSheet);
    }
  }
}

function doGet() {
  return jsonOutput({
    ok: true,
    message: "King Zion's Estate enquiry endpoint is active."
  });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var acquired = lock.tryLock(30000);
  if (!acquired) {
    return jsonOutput({
      ok: false,
      error: 'The system is busy right now. Please try submitting again.'
    });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({
        ok: false,
        error: 'No enquiry data was received.'
      });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonOutput({
        ok: false,
        error: 'Invalid submission format.'
      });
    }

    if (!data || typeof data !== 'object') {
      return jsonOutput({
        ok: false,
        error: 'Invalid enquiry data.'
      });
    }

    var type = cleanCell(data.type).toLowerCase();
    var config = FORM_TABS[type];
    if (!config) {
      return jsonOutput({
        ok: false,
        error: 'Unknown enquiry type.'
      });
    }

    var fullName = cleanCell(data.fullName);
    var phone = cleanCell(data.phone);

    if (!fullName) {
      return jsonOutput({
        ok: false,
        error: 'Full name is required.'
      });
    }

    if (!phone) {
      return jsonOutput({
        ok: false,
        error: 'Phone number is required.'
      });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(config.tabName);
    if (!sheet || sheet.getLastRow() === 0) {
      sheet = ensureTab(ss, config);
    }

    var now = new Date();
    var reference = 'KZE-' + Utilities.formatDate(now, LAGOS_TIMEZONE, 'yyMMdd-HHmmss');
    var lastRow = sheet.getLastRow();

    if (lastRow > 1) {
      var previousReference = cleanCell(sheet.getRange(lastRow, 1).getValue());
      if (previousReference === reference) {
        Utilities.sleep(1050);
        now = new Date();
        reference = 'KZE-' + Utilities.formatDate(now, LAGOS_TIMEZONE, 'yyMMdd-HHmmss');
      }
    }

    var submittedDate = Utilities.formatDate(now, LAGOS_TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    var rowValues = buildRowValues(type, reference, submittedDate, data);

    var nextRow = sheet.getLastRow() + 1;
    var rowRange = sheet.getRange(nextRow, 1, 1, rowValues.length);
    rowRange.setNumberFormat('@');
    rowRange.setValues([rowValues]);
    SpreadsheetApp.flush();

    return jsonOutput({
      ok: true,
      reference: reference
    });
  } catch (err) {
    return jsonOutput({
      ok: false,
      error: 'Unable to save enquiry right now. Please try again.'
    });
  } finally {
    lock.releaseLock();
  }
}

function ensureTab(ss, config) {
  var sheet = ss.getSheetByName(config.tabName);
  if (!sheet) {
    sheet = ss.insertSheet(config.tabName);
  }

  var headerRange = sheet.getRange(1, 1, 1, config.headers.length);
  headerRange.setNumberFormat('@');
  headerRange.setValues([config.headers]);
  headerRange.setFontWeight('bold');
  sheet.setFrozenRows(1);

  return sheet;
}

function buildRowValues(type, reference, submittedDate, data) {
  var commonStart = [
    cleanCell(reference),
    cleanCell(submittedDate),
    cleanCell(data.fullName),
    cleanCell(data.phone),
    cleanCell(data.whatsapp),
    cleanCell(data.email),
    cleanCell(data.preferredContactMethod)
  ];

  if (type === 'inspection') {
    return commonStart.concat([
      cleanCell(data.propertyOrProject),
      cleanCell(data.preferredInspectionDate),
      cleanCell(data.alternativeDate),
      cleanCell(data.preferredTime),
      cleanCell(data.attendeesCount),
      cleanCell(data.comments),
      'Pending'
    ]);
  }

  if (type === 'purchase') {
    return commonStart.concat([
      cleanCell(data.propertyCategory),
      cleanCell(data.selectedProperty),
      cleanCell(data.preferredLocation),
      cleanCell(data.residentialAddress),
      cleanCell(data.preferredHouseType),
      cleanCell(data.bedroomPreference),
      cleanCell(data.intendedUse),
      cleanCell(data.purchaseTimeline),
      cleanCell(data.preferredInspectionDate),
      cleanCell(data.paymentPreference),
      cleanCell(data.budget),
      cleanCell(data.additionalQuestions)
    ]);
  }

  if (type === 'rental') {
    return commonStart.concat([
      cleanCell(data.rentalCategory),
      cleanCell(data.rentalDuration),
      cleanCell(data.preferredLocation),
      cleanCell(data.budget),
      cleanCell(data.selectedProperty),
      cleanCell(data.accommodationType),
      cleanCell(data.bedrooms),
      cleanCell(data.occupants),
      cleanCell(data.checkInDate),
      cleanCell(data.checkOutDate),
      cleanCell(data.moveInDate),
      cleanCell(data.additionalRequests)
    ]);
  }

  if (type === 'land') {
    return commonStart.concat([
      cleanCell(data.selectedProperty),
      cleanCell(data.preferredLocation),
      cleanCell(data.residentialAddress),
      cleanCell(data.preferredPlotSize),
      cleanCell(data.plotQuantity),
      cleanCell(data.intendedLandUse),
      cleanCell(data.intendedUse),
      cleanCell(data.purchaseTimeline),
      cleanCell(data.preferredInspectionDate),
      cleanCell(data.paymentPreference),
      cleanCell(data.budget),
      cleanCell(data.additionalQuestions)
    ]);
  }

  // custom
  return commonStart.concat([
    cleanCell(data.propertyCategory),
    cleanCell(data.preferredLocation),
    cleanCell(data.budget),
    cleanCell(data.propertyTypeOrLandSize),
    cleanCell(data.bedrooms),
    cleanCell(data.requestedRentalDuration),
    cleanCell(data.intendedUse),
    cleanCell(data.expectedTimeline),
    cleanCell(data.description)
  ]);
}

function cleanCell(value) {
  if (value === null || value === undefined) {
    return '';
  }
  var text = String(value).replace(/\r\n/g, '\n').trim();
  if (text.length > MAX_CELL_LENGTH) {
    text = text.substring(0, MAX_CELL_LENGTH);
  }
  return text;
}

function jsonOutput(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
