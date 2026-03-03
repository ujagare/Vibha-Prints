/**
 * Hotjar Service
 * 
 * This service provides utility functions for interacting with Hotjar
 * beyond the basic tracking script.
 */

// Check if Hotjar is loaded and available
const isHotjarAvailable = () => {
  return typeof window !== 'undefined' && window.hj && typeof window.hj === 'function';
};

/**
 * Identify a user in Hotjar
 * @param {string} userId - Unique identifier for the user
 * @param {Object} attributes - User attributes to track
 */
export const identifyUser = (userId, attributes = {}) => {
  if (!isHotjarAvailable()) return;
  
  try {
    window.hj('identify', userId, attributes);
    console.log('Hotjar: User identified', userId);
  } catch (error) {
    console.error('Hotjar: Error identifying user', error);
  }
};

/**
 * Track a custom event in Hotjar
 * @param {string} eventName - Name of the event to track
 */
export const trackEvent = (eventName) => {
  if (!isHotjarAvailable()) return;
  
  try {
    window.hj('event', eventName);
    console.log('Hotjar: Event tracked', eventName);
  } catch (error) {
    console.error('Hotjar: Error tracking event', error);
  }
};

/**
 * Set a Hotjar state variable
 * @param {string} name - Name of the state variable
 * @param {string} value - Value of the state variable
 */
export const setState = (name, value) => {
  if (!isHotjarAvailable()) return;
  
  try {
    window.hj('stateChange', `${name}=${value}`);
    console.log('Hotjar: State changed', name, value);
  } catch (error) {
    console.error('Hotjar: Error changing state', error);
  }
};

/**
 * Trigger Hotjar survey
 * @param {number} surveyId - ID of the survey to trigger
 */
export const triggerSurvey = (surveyId) => {
  if (!isHotjarAvailable()) return;
  
  try {
    window.hj('trigger', surveyId.toString());
    console.log('Hotjar: Survey triggered', surveyId);
  } catch (error) {
    console.error('Hotjar: Error triggering survey', error);
  }
};

/**
 * Add tags to the current Hotjar recording
 * @param {Array<string>} tags - Tags to add to the recording
 */
export const addTags = (tags) => {
  if (!isHotjarAvailable() || !Array.isArray(tags)) return;
  
  try {
    window.hj('tagRecording', tags);
    console.log('Hotjar: Tags added', tags);
  } catch (error) {
    console.error('Hotjar: Error adding tags', error);
  }
};

export default {
  identifyUser,
  trackEvent,
  setState,
  triggerSurvey,
  addTags
};
