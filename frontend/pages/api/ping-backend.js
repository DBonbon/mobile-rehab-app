// pages/api/ping-backend.js
export default async function handler(req, res) {
    try {
      // Simple fetch to keep the backend warm
      const response = await fetch(`${process.env.WAGTAIL_API_URL}/v1/page_by_path/?htmlPath=/`);
      
      if (response.ok) {
        res.status(200).json({ success: true, message: 'Backend pinged successfully' });
      } else {
        res.status(response.status).json({ success: false, message: 'Backend returned an error' });
      }
    } catch (error) {
      console.error('Error pinging backend:', error);
      res.status(500).json({ success: false, message: 'Failed to ping backend', error: error.message });
    }
  }