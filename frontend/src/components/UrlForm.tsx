import React, { useState } from 'react';

interface UrlFormProps {
  token?: string | null;
}

const UrlForm: React.FC<UrlFormProps> = ({ token }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      new URL(originalUrl);
    } catch {
      setError('Invalid URL');
      return;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch('http://localhost:5000/api/v1/shorten', {
        method: 'POST',
        headers,
        body: JSON.stringify({ originalUrl, customSlug: customSlug || undefined })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.errors[0]?.detail || 'Something went wrong');
      } else {
        setShortUrl(data.data.attributes.shortUrl);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div>
      <h2>Shorten a URL</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="originalUrl">Original URL:</label>
          <input
            id="originalUrl"
            type="url"
            placeholder="https://example.com"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="customSlug">Custom Slug (optional):</label>
          <input
            id="customSlug"
            type="text"
            placeholder="customSlug"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
          />
        </div>
        <button type="submit">Shorten</button>
      </form>
      {error && <p className="error">{error}</p>}
      {shortUrl && (
        <div>
          <p>
            Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          </p>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
