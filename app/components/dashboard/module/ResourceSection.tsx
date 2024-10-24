import { Resource } from "@/app/utils/types";

export const ResourceSection = ({ title, resources }: { title: string, resources: Resource[] }) => {
    const groupedByConcept = resources.reduce<Record<string, Resource[]>>((acc, resource) => {
        const conceptName = resource.concept?.name || ' ';
        if (!acc[conceptName]) {
            acc[conceptName] = [];
        }
        acc[conceptName].push(resource);
        return acc;
    }, {});

    return (
        <div className="aspect-video md:aspect-square rounded-xl bg-muted/50 p-2 flex-col gap-2 overflow-y-auto text-center">
            <h1 className="w-full text-center font-bold mt-2 text-2xl">{title}</h1>
            {Object.keys(groupedByConcept).length > 0 ? (
                Object.keys(groupedByConcept).map((conceptName) => (
                    <div key={conceptName} className="mt-4">
                        <hr />
                        <h2 className="text-xl font-semibold">{conceptName}</h2>
                        <hr />
                        {groupedByConcept[conceptName].map((resource) => (
                            <div key={resource.id} className="mt-2">
                                <a href={resource.slug} target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:underline'>
                                    {resource.name}
                                </a>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No {title.toLowerCase()} available.</p>
            )}
        </div>
    );
};
