"use client"
import { Resource } from '@/app/utils/types';
import React, { useState } from 'react'
import { ResourceSection } from './ResourceSection';



export default function ClientModules({ initialResources, userId }: { initialResources: Resource[], userId: string }) {
    //const [resources, setResources] = useState<Resource[]>(initialResources);
    const [resources] = useState<Resource[]>(initialResources);

    // // Function to fetch and update resources
    // const fetchResources = async () => {
    //     const res = await fetch(`/api/modules/${moduleSlug}/resources`);
    //     const data: Resource[] = await res.json();
    //     setResources(data);
    // };



    return (
        <>
            <div className='flex flex-col gap-4'>
                {/* Render Resources */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ResourceSection title="Textbook Resources" resources={resources.filter(res => res.type === 'TEXTBOOK')} userId={userId} />
                    <ResourceSection title="Tutorial Letters" resources={resources.filter(res => res.type === 'TUTORIAL_LETTER')} userId={userId}/>
                    <ResourceSection title="Additional Resources" resources={resources.filter(res => res.type === 'ADDITIONAL_RESOURCE')} userId={userId} />
                    <ResourceSection title="YouTube Links" resources={resources.filter(res => res.type === 'YOUTUBE_LINK')} userId={userId} />
                </div>
            </div>
        </>
    )
}

