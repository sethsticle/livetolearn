"use client"
import { Resource } from '@/app/utils/types';
import React, { useState } from 'react'
import { BackButton } from '../../BackButton';
import { ResourceSection } from './ResourceSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requireUser } from '@/app/utils/requireUser';
import prisma from '@/app/utils/db';

export default function ClientModules({ courseId, initialResources, moduleSlug, isAdmin }: { courseId: string, initialResources: Resource[], moduleSlug: string, isAdmin: boolean }) {
    const [resources, setResources] = useState<Resource[]>(initialResources);

    // // Function to fetch and update resources
    // const fetchResources = async () => {
    //     const res = await fetch(`/api/modules/${moduleSlug}/resources`);
    //     const data: Resource[] = await res.json();
    //     setResources(data);
    // };

    return (
        <>
            <div className='flex flex-col gap-4 '>
                {/* Title and buttons */}
                <div className="flex flex-row align-middle items-center w-full justify-between">
                    <BackButton path={`/dashboard/courses/${courseId}`} text="Back to Course" />
                    <div className='flex flex-row gap-2'>
                        {isAdmin && (
                            <Button asChild><Link href={`/dashboard/new/editcourse/${courseId}/editmodule/${moduleSlug}/addconcept`}>Add Concept</Link></Button>
                        )}
                        <Button asChild><Link href={`/dashboard/new/editcourse/${courseId}/editmodule/${moduleSlug}/addresource`}>Add Resource</Link></Button>
                    </div>
                </div>

                {/* Render Resources */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <ResourceSection title="Textbook Resources" resources={resources.filter(res => res.type === 'TEXTBOOK')} />
                    <ResourceSection title="Tutorial Letters" resources={resources.filter(res => res.type === 'TUTORIAL_LETTER')} />
                    <ResourceSection title="Additional Resources" resources={resources.filter(res => res.type === 'ADDITIONAL_RESOURCE')} />
                    <ResourceSection title="YouTube Links" resources={resources.filter(res => res.type === 'YOUTUBE_LINK')} />
                </div>
            </div>
        </>
    )
}

