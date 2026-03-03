import { useEffect } from 'react';

/**
 * Component to add Google Ads conversion tracking to your website
 * @param {Object} props - Component props
 * @param {string} props.conversionId - Your Google Ads conversion ID
 * @param {string} props.conversionLabel - Your Google Ads conversion label (optional)
 */
const GoogleAdsScript = ({ conversionId, conversionLabel }) => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Create and add the Google Ads global site tag (gtag.js)
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=AW-${conversionId}`;
    
    // Add the script to the document head
    document.head.appendChild(script);

    // Initialize the gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', `AW-${conversionId}`);

    // Store the gtag function globally
    window.gtag = gtag;

    // Clean up on unmount
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [conversionId]);

  return null;
};

export default GoogleAdsScript;
