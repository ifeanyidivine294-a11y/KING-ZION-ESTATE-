const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzonwBMjcKLZEqWTWV3YcxB0n48CrH6Br0xgSKJ6P0DbMLHeCRDQIgFuZaOEXXg7OzH/exec";

export type AppsScriptEnquiryType = 'inspection' | 'purchase' | 'rental' | 'land' | 'custom';

export interface AppsScriptEnquiryPayload {
  type: AppsScriptEnquiryType;
  fullName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  preferredContactMethod?: string;
  propertyOrProject?: string;
  preferredInspectionDate?: string;
  alternativeDate?: string;
  preferredTime?: string;
  attendeesCount?: string;
  comments?: string;
  propertyCategory?: string;
  selectedProperty?: string;
  preferredLocation?: string;
  residentialAddress?: string;
  preferredHouseType?: string;
  bedroomPreference?: string;
  intendedUse?: string;
  purchaseTimeline?: string;
  paymentPreference?: string;
  budget?: string;
  additionalQuestions?: string;
  rentalCategory?: string;
  rentalDuration?: string;
  accommodationType?: string;
  bedrooms?: string;
  occupants?: string;
  checkInDate?: string;
  checkOutDate?: string;
  moveInDate?: string;
  additionalRequests?: string;
  preferredPlotSize?: string;
  plotQuantity?: string;
  intendedLandUse?: string;
  propertyTypeOrLandSize?: string;
  requestedRentalDuration?: string;
  expectedTimeline?: string;
  description?: string;
}

export interface AppsScriptSubmitResponse {
  ok: boolean;
  reference?: string;
  error?: string;
}

export async function submitEnquiryToAppsScript(
  payload: AppsScriptEnquiryPayload
): Promise<AppsScriptSubmitResponse> {
  const endpoint: string = SCRIPT_URL;
  if (!endpoint || !endpoint.startsWith('https://script.google.com/')) {
    return {
      ok: false,
      error:
        'Enquiry form endpoint is not configured yet. Please paste the Google Apps Script Web App URL into SCRIPT_URL.',
    };
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: 'We could not save your enquiry right now. Please try again in a moment.',
      };
    }

    const result = (await response.json()) as AppsScriptSubmitResponse;
    if (!result || result.ok !== true || !result.reference) {
      return {
        ok: false,
        error:
          (result && result.error) ||
          'We could not complete your submission. Your details are still here — please try again.',
      };
    }

    return {
      ok: true,
      reference: result.reference,
    };
  } catch {
    return {
      ok: false,
      error:
        'Network error while sending your enquiry. Your details have been kept — please check your connection and try again.',
    };
  }
}
