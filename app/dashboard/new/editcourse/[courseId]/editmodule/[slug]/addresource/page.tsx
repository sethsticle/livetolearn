import { fetchConcepts } from '@/app/actions';
import AddResourcePage from '@/app/components/dashboard/new/editcourse/AddResourcePage';
import React from 'react'

async function AddResource({ params }: { params: { courseId: string, slug: string } }) {
  const concepts = await fetchConcepts({ moduleSlug: params.slug });

  return (
    <div>
      <AddResourcePage params={params} concepts={concepts} />
    </div>
  );
}

export default AddResource;
