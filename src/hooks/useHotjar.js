import { useEffect, useCallback } from 'react';
import { 
  identifyUser, 
  trackEvent, 
  setState, 
  triggerSurvey, 
  addTags 
} from '../services/hotjarService';

/**
 * Custom hook for Hotjar integration
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.userId - User ID for identification (optional)
 * @param {Object} options.userAttributes - User attributes for identification (optional)
 * @param {Array<string>} options.pageTags - Tags to add to the recording on page load (optional)
 * @returns {Object} - Hotjar utility functions
 */
const useHotjar = (options = {}) => {
  const { userId, userAttributes, pageTags } = options;
  
  // Identify user when the component mounts if userId is provided
  useEffect(() => {
    if (userId) {
      identifyUser(userId, userAttributes || {});
    }
  }, [userId, userAttributes]);
  
  // Add tags when the component mounts if pageTags are provided
  useEffect(() => {
    if (pageTags && Array.isArray(pageTags) && pageTags.length > 0) {
      addTags(pageTags);
    }
  }, [pageTags]);
  
  // Track page view
  useEffect(() => {
    trackEvent('page_view');
  }, []);
  
  // Memoized functions to prevent unnecessary re-renders
  const track = useCallback((eventName) => {
    trackEvent(eventName);
  }, []);
  
  const identify = useCallback((id, attributes = {}) => {
    identifyUser(id, attributes);
  }, []);
  
  const setHjState = useCallback((name, value) => {
    setState(name, value);
  }, []);
  
  const triggerHjSurvey = useCallback((surveyId) => {
    triggerSurvey(surveyId);
  }, []);
  
  const addHjTags = useCallback((tags) => {
    addTags(tags);
  }, []);
  
  return {
    track,
    identify,
    setState: setHjState,
    triggerSurvey: triggerHjSurvey,
    addTags: addHjTags
  };
};

export default useHotjar;
