import React from 'react';
import { mockArticles } from '../data/mockArticles';

const Articles = () => {
  return (
    <div>
      <h2>Articles & Tips</h2>
      <ul>
        {mockArticles.map(article => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Articles;