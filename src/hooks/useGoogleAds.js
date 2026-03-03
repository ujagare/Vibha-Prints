import { useCallback, useEffect } from 'react';
import { trackConversion, trackPageView, trackEvent } from '../services/googleAdsService';

/**
 * Custom hook for Google Ads conversion tracking
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.conversionId - Your Google Ads conversion ID
 * @param {boolean} options.trackPageViews - Whether to automatically track page views
 * @returns {Object} - Google Ads utility functions
 */
const useGoogleAds = (options = {}) => {
  const { conversionId, trackPageViews = true } = options;
  
  // Track page view when the component mounts if trackPageViews is true
  useEffect(() => {
    if (trackPageViews && conversionId) {
      trackPageView(conversionId);
    }
  }, [trackPageViews, conversionId]);
  
  // Memoized functions to prevent unnecessary re-renders
  const trackConversionEvent = useCallback((conversionLabel, options = {}) => {
    if (!conversionId) {
      console.warn('Google Ads conversion ID is required');
      return;
    }
    
    trackConversion(conversionId, conversionLabel, options);
  }, [conversionId]);
  
  const trackCustomEvent = useCallback((eventName, eventParams = {}) => {
    trackEvent(eventName, eventParams);
  }, []);
  
  const trackPageViewEvent = useCallback((options = {}) => {
    if (!conversionId) {
      console.warn('Google Ads conversion ID is required');
      return;
    }
    
    trackPageView(conversionId, options);
  }, [conversionId]);
  
  return {
    trackConversion: trackConversionEvent,
    trackEvent: trackCustomEvent,
    trackPageView: trackPageViewEvent
  };
};

export default useGoogleAds;
