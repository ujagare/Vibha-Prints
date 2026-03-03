import { useEffect } from 'react';

// This component will inject the Hotjar tracking code into your React application
const HotjarScript = ({ hotjarId }) => {
  useEffect(() => {
    // Only run this in the browser, not during server-side rendering
    if (typeof window !== 'undefined') {
      // Create Hotjar tracking code
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:hotjarId,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }
  }, [hotjarId]);

  // This component doesn't render anything
  return null;
};

export default HotjarScript;
