# Hotjar Integration Guide

This document explains how to use Hotjar in your Vibha Art website.

## What is Hotjar?

Hotjar is an analytics and feedback tool that helps you understand how users behave on your website, what they need, and how they feel, through tools like heatmaps, session recordings, and surveys.

## Basic Setup

The basic Hotjar tracking script is already set up in the application through the `HotjarScript` component in `App.jsx`. This component loads the Hotjar tracking code with your Hotjar ID.

```jsx
<HotjarScript hotjarId="3851307" />
```

## Using Hotjar in Components

### The useHotjar Hook

We've created a custom hook `useHotjar` that makes it easy to use Hotjar features in your components:

```jsx
import useHotjar from '../hooks/useHotjar';

const MyComponent = () => {
  // Initialize with optional configuration
  const hotjar = useHotjar({
    // Optional: Identify user if known
    userId: 'user123',
    // Optional: Add user attributes
    userAttributes: {
      userType: 'customer',
      plan: 'premium'
    },
    // Optional: Add tags to the recording
    pageTags: ['checkout-page', 'payment-flow']
  });

  // Now you can use Hotjar methods
  const handleButtonClick = () => {
    // Track custom events
    hotjar.track('button_clicked');
  };

  return (
    <button onClick={handleButtonClick}>
      Click Me
    </button>
  );
};
```

### Available Methods

The `useHotjar` hook provides the following methods:

1. **track(eventName)** - Track custom events
   ```jsx
   hotjar.track('form_submitted');
   ```

2. **identify(userId, attributes)** - Identify a user
   ```jsx
   hotjar.identify('user123', {
     email: 'user@example.com',
     accountType: 'premium'
   });
   ```

3. **setState(name, value)** - Set state variables for targeting
   ```jsx
   hotjar.setState('checkout_completed', 'true');
   ```

4. **triggerSurvey(surveyId)** - Trigger a specific survey
   ```jsx
   hotjar.triggerSurvey(123456);
   ```

5. **addTags(tags)** - Add tags to the current recording
   ```jsx
   hotjar.addTags(['checkout', 'payment-method-credit-card']);
   ```

## Best Practices

1. **User Privacy**: Only collect data that you need and ensure you have proper consent mechanisms in place.

2. **Performance**: Hotjar is designed to have minimal impact on page performance, but be mindful of adding too many event tracking calls.

3. **Meaningful Events**: Track events that provide actionable insights rather than tracking everything.

4. **User Identification**: Only identify users when you have their consent and a legitimate reason to do so.

## Setting Up in Hotjar Dashboard

1. **Create a Hotjar Account**: Sign up at [hotjar.com](https://www.hotjar.com/)

2. **Add Your Site**: In the Hotjar dashboard, add your website

3. **Configure Heatmaps**: Set up heatmaps for specific pages

4. **Configure Recordings**: Adjust recording settings as needed

5. **Create Surveys**: Design surveys to collect user feedback

6. **Set Up Funnels**: Create funnels to track user journeys

## Troubleshooting

If Hotjar is not working as expected:

1. Check the browser console for errors
2. Verify that the Hotjar script is loading correctly
3. Ensure your Hotjar ID is correct
4. Check if any ad blockers or privacy extensions are blocking Hotjar
5. Verify that the Content Security Policy allows Hotjar domains

## Resources

- [Hotjar Documentation](https://help.hotjar.com/)
- [Hotjar API Reference](https://help.hotjar.com/hc/en-us/articles/115011639927-How-to-Identify-API)
- [Hotjar Privacy & Security](https://help.hotjar.com/hc/en-us/categories/115001323967-Privacy-Security)
