import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { SearchCommunityResponseDto, CommunityResponseDto } from "@edifice.io/community-client-rest";


const App: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const response: SearchCommunityResponseDto = await (await fetch('/community/api/communities')).json();
        console.log('API Response:', response);
        setCommunities(response.communities || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des communautés');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Chargement des communautés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="communities-container">
      <h1>Liste des communautés</h1>
      
      {communities.length === 0 ? (
        <p>Aucune communauté trouvée.</p>
      ) : (
        <ul className="communities-list">
          {communities.map((community) => (
            <li key={community.id} className="community-item">
              <div className="community-card">
                {community.image && (
                  <img 
                    src={community.image} 
                    alt={`${community.title}`} 
                    className="community-image" 
                  />
                )}
                <div className="community-info">
                  <h3>{community.title}</h3>
                  <p>Type: {community.type}</p>
                  <p>Créée le: {new Date(community.creationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="debug-info">
        <p>Total: {communities.length} communautés</p>
        <button onClick={() => console.log(communities)}>
          Log data to console
        </button>
      </div>
    </div>
  );
};  

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);