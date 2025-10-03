import React, { useState } from 'react';
import { mockArticles } from '../data/mockArticles';

const ArticleSection = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4">Language Learning Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockArticles.map(article => (
          <div key={article.id} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="font-bold text-lg mb-2">{article.title}</h3>
            <p>{expandedId === article.id ? article.content : article.excerpt}</p>
            <button
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() =>
                setExpandedId(expandedId === article.id ? null : article.id)
              }
            >
              {expandedId === article.id ? "Show Less" : "Read More"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
export default ArticleSection;