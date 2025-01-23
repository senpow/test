import React, { useEffect, useState } from 'react';
import { CampaignForm } from './components/CampaignForm';
import { sendFoxApi } from './lib/api';
import type { List, ApiError } from './types';
import { Mail, ExternalLink } from 'lucide-react';

function App() {
  const [lists, setLists] = useState<List[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists();
  }, []);

  async function loadLists() {
    try {
      const fetchedLists = await sendFoxApi.getLists();
      if (Array.isArray(fetchedLists)) {
        setLists(fetchedLists);
      } else {
        throw new Error('Invalid response format from SendFox API');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load mailing lists. Please try again later.');
      console.error('Error loading lists:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: any) {
    setError(null);
    setSuccess(null);
    
    try {
      await sendFoxApi.createCampaign(data);
      setSuccess('Campaign created successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      if (apiError.message.includes('SendFox web interface')) {
        window.open('https://sendfox.com/login', '_blank');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Email Campaign Manager
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Create and send beautiful email campaigns to your subscribers
          </p>
          <a
            href="https://sendfox.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
          >
            Go to SendFox Dashboard <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>

        {(error || success) && (
          <div className="mb-8">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{success}</div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading lists...</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <CampaignForm lists={lists} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;