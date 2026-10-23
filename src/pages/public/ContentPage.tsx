import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { ContentPage as ContentPageData } from '../../types/index.ts';

export const ContentPage: React.FC = () => {
  const { slug = '' } = useParams();
  const [page, setPage] = useState<ContentPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const originalTitle = document.title;
    const originalDescription = document.querySelector('meta[name="description"]');
    const originalDescriptionContent = originalDescription?.getAttribute('content') || null;
    setLoading(true);
    setError('');
    api.getPublishedPage(slug)
      .then((data) => {
        if (active) {
          setPage(data);
          document.title = data.seoTitle || data.title;
          if (data.seoDescription) {
            let description = document.querySelector('meta[name="description"]');
            if (!description) {
              description = document.createElement('meta');
              description.setAttribute('name', 'description');
              document.head.appendChild(description);
            }
            description.setAttribute('content', data.seoDescription);
          } else {
            document.querySelector('meta[name="description"]')?.remove();
          }
        }
      })
      .catch((err: Error) => {
        if (active) setError(err.message || 'This page is unavailable.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      document.title = originalTitle;
      const currentDescription = document.querySelector('meta[name="description"]');
      if (originalDescription) {
        if (originalDescriptionContent !== null) {
          originalDescription.setAttribute('content', originalDescriptionContent);
        } else {
          originalDescription.removeAttribute('content');
        }
        if (!originalDescription.isConnected) document.head.appendChild(originalDescription);
      } else {
        currentDescription?.remove();
      }
    };
  }, [slug]);

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center"><Spin size="large" /></div>;
  }

  if (error || !page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif-title text-3xl font-bold text-stone-900">Page unavailable</h1>
        <p role="alert" className="text-sm text-stone-600 mt-3">{error || 'This page is not published.'}</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
      <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-stone-900 mb-8">
        {page.title}
      </h1>
      <div
        className="content-page text-stone-700 leading-7 [&_h2]:font-serif-title [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-stone-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[#7A1C24] [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
    </article>
  );
};
