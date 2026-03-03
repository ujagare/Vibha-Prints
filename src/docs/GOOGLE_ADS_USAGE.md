# Google Ads Conversion Tracking Guide

This document explains how to use Google Ads conversion tracking in your Vibha Art website.

## What is Google Ads Conversion Tracking?

Google Ads conversion tracking is a free tool that shows you what happens after a customer interacts with your ads — whether they purchased a product, signed up for your newsletter, called your business, or downloaded your app. When a customer completes an action that you've defined as valuable, these customer actions are called "conversions."

## Basic Setup

The basic Google Ads tracking script is already set up in the application through the `GoogleAdsScript` component in `App.jsx`. This component loads the Google Ads tracking code with your conversion ID.

```jsx
<GoogleAdsScript conversionId="123456789" />
```

**Note:** You need to replace `"123456789"` with your actual Google Ads conversion ID.

## Using Google Ads Conversion Tracking in Components

### The useGoogleAds Hook

We've created a custom hook `useGoogleAds` that makes it easy to track conversions in your components:

```jsx
import useGoogleAds from '../hooks/useGoogleAds';

const MyComponent = () => {
  // Initialize with your conversion ID
  const googleAds = useGoogleAds({
    conversionId: '123456789', // Replace with your actual Google Ads conversion ID
    trackPageViews: true // Automatically track page views
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Track form submission conversion
    googleAds.trackConversion('abcdefghij', { // Replace with your actual conversion label
      value: 0, // No monetary value for form submissions
    });
    
    // Form submission logic...
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Form fields */}
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Available Methods

The `useGoogleAds` hook provides the following methods:

1. **trackConversion(conversionLabel, options)** - Track a specific conversion
   ```jsx
   googleAds.trackConversion('abcdefghij', {
     value: 99.99,
     currency: 'INR',
     transactionId: 'ORDER-123'
   });
   ```

2. **trackEvent(eventName, eventParams)** - Track a custom event
   ```jsx
   googleAds.trackEvent('add_to_cart', {
     value: 99.99,
     items: ['logo_design'],
     category: 'design_services'
   });
   ```

3. **trackPageView(options)** - Manually track a page view
   ```jsx
   googleAds.trackPageView({
     pagePath: '/thank-you',
     pageTitle: 'Thank You Page'
   });
   ```

## Common Conversion Types

Here are some common conversion types you might want to track:

### 1. Form Submissions

```jsx
const handleFormSubmit = (e) => {
  e.preventDefault();
  
  // Track form submission
  googleAds.trackConversion('your_form_conversion_label', {
    value: 0
  });
  
  // Form submission logic...
};
```

### 2. Purchases

```jsx
const handlePurchase = () => {
  // Track purchase
  googleAds.trackConversion('your_purchase_conversion_label', {
    value: 99.99, // The value of the purchase
    currency: 'INR', // The currency
    transactionId: `ORDER-${Date.now()}` // A unique transaction ID
  });
  
  // Purchase logic...
};
```

### 3. Phone Calls

```jsx
const handlePhoneClick = () => {
  // Track phone call
  googleAds.trackConversion('your_call_conversion_label');
  
  // Phone call logic...
};
```

## Setting Up in Google Ads

To use conversion tracking, you need to set up conversion actions in your Google Ads account:

1. **Sign in to your Google Ads account**

2. **Click on "Tools & Settings" in the upper right corner**

3. **Under "Measurement," click "Conversions"**

4. **Click the "+" button to create a new conversion action**

5. **Choose the source of the conversion (Website, App, Phone calls, etc.)**

6. **Configure your conversion action:**
   - Name your conversion
   - Choose a category (Purchase, Sign-up, Lead, etc.)
   - Set a value (if applicable)
   - Set a count (One or Every)
   - Set a conversion window
   - Set an attribution model

7. **Set up the tracking method:**
   - For website conversions, you'll get a conversion ID and conversion label
   - Add these to your code as shown in the examples above

## Best Practices

1. **Use Descriptive Event Names**: Choose clear, descriptive names for your custom events.

2. **Track Valuable Actions**: Focus on tracking actions that are valuable to your business.

3. **Include Transaction Values**: For purchase conversions, always include the transaction value and currency.

4. **Use Unique Transaction IDs**: For purchase conversions, use unique transaction IDs to avoid duplicate counting.

5. **Test Your Implementation**: Use the Google Ads conversion tracking tag helper to verify your implementation.

## Troubleshooting

If conversion tracking is not working as expected:

1. Check the browser console for errors

2. Verify that the Google Ads script is loading correctly

3. Ensure your conversion ID and labels are correct

4. Check if any ad blockers or privacy extensions are blocking Google Ads scripts

5. Verify that the Content Security Policy allows Google Ads domains

## Resources

- [Google Ads Help: About conversion tracking](https://support.google.com/google-ads/answer/1722022)
- [Google Ads Help: Set up conversion tracking for your website](https://support.google.com/google-ads/answer/6095821)
- [Google Ads Help: Track conversions on your website](https://support.google.com/google-ads/answer/6095821)
