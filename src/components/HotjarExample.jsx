import React, { useState } from 'react';
import useHotjar from '../hooks/useHotjar';

/**
 * Example component demonstrating Hotjar integration
 * This is for demonstration purposes only - you would typically
 * integrate these calls into your existing components
 */
const HotjarExample = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Initialize Hotjar hook with page tags
  const hotjar = useHotjar({
    pageTags: ['example-page', 'documentation']
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Track form submission event
    hotjar.track('form_submitted');
    
    // If you have user identification (e.g., after login)
    if (email) {
      hotjar.identify(email, {
        // You can add custom user attributes
        userType: 'prospect',
        signupDate: new Date().toISOString()
      });
    }
    
    // Set state for potential targeting
    hotjar.setState('form_completion', 'true');
    
    // Trigger a survey (you would need to create this in Hotjar dashboard)
    // hotjar.triggerSurvey(123456);
    
    // Add tags to the recording
    hotjar.addTags(['form_completed', 'potential_customer']);
    
    setSubmitted(true);
  };
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Hotjar Example</h2>
      
      {submitted ? (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          Thank you for your submission!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E65056] focus:border-[#E65056]"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#E65056] text-white py-2 px-4 rounded-md hover:bg-[#E65056]/90 transition-colors"
            onClick={() => hotjar.track('submit_button_clicked')}
          >
            Submit
          </button>
        </form>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>This example demonstrates Hotjar integration with:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Event tracking</li>
          <li>User identification</li>
          <li>State changes</li>
          <li>Recording tags</li>
        </ul>
      </div>
    </div>
  );
};

export default HotjarExample;
