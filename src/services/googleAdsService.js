/**
 * Google Ads Conversion Tracking Service
 * 
 * This service provides utility functions for tracking Google Ads conversions
 */

/**
 * Check if Google Ads tracking is available
 * @returns {boolean} Whether gtag is available
 */
const isGtagAvailable = () => {
  return typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function';
};

/**
 * Track a conversion event
 * @param {string} conversionId - Your Google Ads conversion ID
 * @param {string} conversionLabel - Your Google Ads conversion label
 * @param {Object} options - Additional conversion parameters
 * @param {string} options.sendTo - Override the default send_to parameter
 * @param {number} options.value - Conversion value
 * @param {string} options.currency - Currency code (e.g., 'USD')
 * @param {string} options.transactionId - Unique transaction ID
 */
export const trackConversion = (conversionId, conversionLabel, options = {}) => {
  if (!isGtagAvailable()) {
    console.warn('Google Ads tracking is not available');
    return;
  }

  try {
    const conversionParams = {
      send_to: options.sendTo || `AW-${conversionId}/${conversionLabel}`,
    };

    // Add optional parameters if provided
    if (options.value !== undefined) conversionParams.value = options.value;
    if (options.currency) conversionParams.currency = options.currency;
    if (options.transactionId) conversionParams.transaction_id = options.transactionId;

    // Send the conversion event to Google Ads
    window.gtag('event', 'conversion', conversionParams);
    
    console.log('Google Ads conversion tracked:', conversionParams);
  } catch (error) {
    console.error('Error tracking Google Ads conversion:', error);
  }
};

/**
 * Track a page view event
 * @param {string} conversionId - Your Google Ads conversion ID
 * @param {Object} options - Additional page view parameters
 */
export const trackPageView = (conversionId, options = {}) => {
  if (!isGtagAvailable()) {
    console.warn('Google Ads tracking is not available');
    return;
  }

  try {
    const pageViewParams = {
      send_to: `AW-${conversionId}`,
      page_path: options.pagePath || window.location.pathname,
      page_title: options.pageTitle || document.title,
    };

    // Send the page view event to Google Ads
    window.gtag('event', 'page_view', pageViewParams);
    
    console.log('Google Ads page view tracked:', pageViewParams);
  } catch (error) {
    console.error('Error tracking Google Ads page view:', error);
  }
};

/**
 * Track a custom event
 * @param {string} eventName - Name of the custom event
 * @param {Object} eventParams - Additional event parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!isGtagAvailable()) {
    console.warn('Google Ads tracking is not available');
    return;
  }

  try {
    // Send the custom event to Google Ads
    window.gtag('event', eventName, eventParams);
    
    console.log('Google Ads event tracked:', eventName, eventParams);
  } catch (error) {
    console.error('Error tracking Google Ads event:', error);
  }
};

export default {
  trackConversion,
  trackPageView,
  trackEvent
};
