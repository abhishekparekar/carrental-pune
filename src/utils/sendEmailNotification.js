// Utility to send email notifications for Inquiries and Bookings to shubhamastrkar@gmail.com
import axios from 'axios';

const ADMIN_EMAIL = 'shubhamastrkar@gmail.com';

/**
 * Dispatches an email notification to shubhamastrkar@gmail.com
 * using FormSubmit AJAX API with reliable non-blocking fallback.
 */
export async function sendEmailNotification(inquiryData) {
  try {
    const payload = {
      _subject: `🚗 New Car Rental Inquiry: ${inquiryData.carName || 'Vehicle'} - ${inquiryData.customerName || 'Customer'}`,
      _replyto: inquiryData.email && inquiryData.email !== 'N/A' ? inquiryData.email : ADMIN_EMAIL,
      _template: 'table',
      _captcha: 'false',
      'Inquiry Type': inquiryData.carName ? 'Car Rental Booking Inquiry' : 'General Contact Inquiry',
      'Customer Name': inquiryData.customerName || 'N/A',
      'Phone Number': inquiryData.phone || 'N/A',
      'Email Address': inquiryData.email || 'N/A',
      'Vehicle Requested': inquiryData.carName || 'General Inquiry',
      'Pickup City': inquiryData.city || 'Pune',
      'Pickup Date': inquiryData.pickupDate ? new Date(inquiryData.pickupDate).toLocaleString('en-IN') : 'N/A',
      'Return Date': inquiryData.returnDate ? new Date(inquiryData.returnDate).toLocaleString('en-IN') : 'N/A',
      'Rental Days': inquiryData.daysCount ? `${inquiryData.daysCount} Days` : 'N/A',
      'Estimated Tariff': inquiryData.estimatedPrice ? `₹${inquiryData.estimatedPrice}` : 'N/A',
      'Pickup / Delivery Mode': inquiryData.pickupType || 'Doorstep Delivery',
      'Customer Message': inquiryData.message || 'None',
      'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Admin Portal URL': `${window.location.origin}/admin/inquiries`,
    };

    // Primary delivery: FormSubmit AJAX endpoint to shubhamastrkar@gmail.com
    await axios.post(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 8000,
    });

    console.log(`[Email Notification] Successfully dispatched to ${ADMIN_EMAIL}`);
    return { success: true };
  } catch (error) {
    console.warn('[Email Notification] FormSubmit notice:', error?.message || error);
    // Non-blocking: Inquiry is already safely saved in Firestore & local cache
    return { success: false, error };
  }
}
