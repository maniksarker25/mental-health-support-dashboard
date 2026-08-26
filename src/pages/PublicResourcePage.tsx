import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminStore } from '../contexts/AdminStore';
import { ResourceWebsiteRenderer } from '../components/public/ResourceWebsiteRenderer';
import { Button } from '../components/ui/Button';
import { HeartIcon } from 'lucide-react';

export function PublicResourcePage() {
  const { slug } = useParams<{ slug: string }>();
  const { topics } = useAdminStore();

  const resource = topics.find(
    (t) => t.slug === slug || t.id === slug || (t.title && t.title.toLowerCase() === slug?.toLowerCase())
  ) || topics[0];

  if (!resource) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas p-6 text-center text-ink">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-tint text-primary">
          <HeartIcon className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">Resource Not Found</h1>
        <p className="mt-2 max-w-md text-sm text-body">
          This confidential resource link may have expired or been moved.
        </p>
        <div className="mt-6">
          <Link to="/dashboard">
            <Button variant="secondary">Return to Console</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <ResourceWebsiteRenderer resource={resource} />;
}
