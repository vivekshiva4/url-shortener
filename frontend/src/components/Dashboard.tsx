import React, { useEffect, useState } from 'react';

interface ShortUrl {
  id: string;
  attributes: {
    originalUrl: string;
    visits: number;
    shortUrl: string;
  }
}

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/user/urls', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setUrls(data.data);
        } else {
          setError(data.errors[0]?.detail || 'Failed to load URLs');
        }
      } catch {
        setError('Network error');
      }
    };
    fetchUrls();
  }, [token]);

  return (
    <div className="dashboard">
      <h2>Your Shortened URLs</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {urls.map(url => (
          <li key={url.id}>
            <a href={url.attributes.shortUrl} target="_blank" rel="noopener noreferrer">
              {url.attributes.shortUrl}
            </a> – {url.attributes.visits} visits
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
