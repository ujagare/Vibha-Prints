import React, { useState } from 'react';
import useGoogleAds from '../hooks/useGoogleAds';

/**
 * Example component demonstrating Google Ads conversion tracking
 * This is for demonstration purposes only - you would typically
 * integrate these calls into your existing components
 */
const GoogleAdsExample = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  
  // Initialize Google Ads hook with your conversion ID
  const googleAds = useGoogleAds({
    conversionId: '123456789', // Replace with your actual Google Ads conversion ID
    trackPageViews: true
  });
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Track form submission conversion
    googleAds.trackConversion('abcdefghij', { // Replace with your actual conversion label
      value: 0, // No monetary value for form submissions
    });
    
    setFormSubmitted(true);
  };
  
  const handlePurchase = () => {
    // Track purchase conversion
    googleAds.trackConversion('klmnopqrst', { // Replace with your actual conversion label
      value: 99.99, // The value of the purchase
      currency: 'INR', // The currency
      transactionId: `ORDER-${Date.now()}` // A unique transaction ID
    });
    
    // Track custom event
    googleAds.trackEvent('purchase_completed', {
      value: 99.99,
      items: ['design_package'],
      new_customer: true
    });
    
    setPurchaseCompleted(true);
  };
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Google Ads Conversion Tracking Example</h2>
      
      {/* Form Submission Example */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Contact Form Example</h3>
        
        {formSubmitted ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            Thank you for your submission! We'll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E65056] focus:border-[#E65056]"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E65056] focus:border-[#E65056]"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#E65056] text-white py-2 px-4 rounded-md hover:bg-[#E65056]/90 transition-colors"
            >
              Submit Form
            </button>
          </form>
        )}
      </div>
      
      {/* Purchase Example */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Purchase Example</h3>
        
        {purchaseCompleted ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            Thank you for your purchase! Your order has been confirmed.
          </div>
        ) : (
          <div className="border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-2">Basic Design Package</h4>
            <p className="text-gray-600 mb-4">Logo design, business card, and letterhead</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-800">₹99.99</span>
              <span className="text-sm text-green-600">In Stock</span>
            </div>
            <button
              onClick={handlePurchase}
              className="w-full bg-[#E65056] text-white py-2 px-4 rounded-md hover:bg-[#E65056]/90 transition-colors"
            >
              Complete Purchase
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>This example demonstrates Google Ads conversion tracking for:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Form submissions (lead generation)</li>
          <li>Purchases (with transaction value)</li>
          <li>Custom events</li>
        </ul>
      </div>
    </div>
  );
};

export default GoogleAdsExample;
