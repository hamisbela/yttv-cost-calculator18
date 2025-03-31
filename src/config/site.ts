const siteConfig = {
  title: "YouTube TV Cost Calculator",
  description: "Calculate the cost of YouTube TV subscriptions with various add-ons",
  defaultAuthor: "YouTube TV Team",
  // Get the site URL from environment variable or use a fallback
  siteUrl: import.meta.env.VITE_SITE_URL || "https://youtube-tv-calculator.netlify.app", 
  // Add more site-wide configuration as needed
};

export default siteConfig;