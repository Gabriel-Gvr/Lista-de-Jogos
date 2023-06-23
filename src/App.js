import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';


function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://games-test-api-81e9fb0d564a.herokuapp.com/api/data/', {
          headers: {
            'dev-email-address': 'ocelotmoe@gmail.com'
          }
        });
        setGames(response.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);

  const handleError = (error) => {
    if (error.response) {
      const statusCode = error.response.status;
      if (
        statusCode === 500 ||
        statusCode === 502 ||
        statusCode === 503 ||
        statusCode === 504 ||
        statusCode === 507 ||
        statusCode === 508 ||
        statusCode === 509
      ) {
        setError('O servidor falhou em responder, tente recarregar a página!');
      } else {
        setError('O servidor não conseguirá responder por agora, tente voltar novamente mais tarde');
      }
    } else if (error.request) {
      setError('O servidor demorou para responder, tente mais tarde');
    } else {
      setError('Ocorreu um erro ao processar sua solicitação!');
    }
    setLoading(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAndGenreGames = selectedGenre
    ? filteredGames.filter((game) => game.genre === selectedGenre)
    : filteredGames;

    return (
      <div className="container">
        <div className="search-filter">
          <h1>Lista de Jogos</h1>
          <div className="search-filter-container">
            <input type="text" placeholder="Buscar por título" value={searchTerm} onChange={handleSearch} />
            <select value={selectedGenre} onChange={handleGenreChange}>
              <option value="">Todos</option>
              {Array.from(new Set(games.map((game) => game.genre))).map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="game-list">
            {filteredAndGenreGames.map((game) => (
              <div key={game.id} className="game-card">
                <img src={game.thumbnail} alt={game.title} />
                <h3>{game.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    );
    
}



export default App;



