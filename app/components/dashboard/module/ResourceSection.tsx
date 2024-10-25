"use client"
import { useState } from 'react';
import { handleVote } from '@/app/voteActions';
import { Resource } from '@/app/utils/types';
import { ArrowUp, ArrowDown } from 'lucide-react'; // Importing icons from lucide-react

export const ResourceSection = ({ title, resources, userId }: { title: string, resources: Resource[], userId: string }) => {
  const groupedByConcept = resources.reduce<Record<string, Resource[]>>((acc, resource) => {
    const conceptName = resource.concept?.name || ' ';
    if (!acc[conceptName]) acc[conceptName] = [];
    acc[conceptName].push(resource);
    return acc;
  }, {});

  const [votes, setVotes] = useState<Record<string, { upVotes: number, downVotes: number, userVote: "upvote" | "downvote" | null, isLoading: "upvote" | "downvote" | null }>>(
    resources.reduce((acc, resource) => {
      acc[resource.id] = {
        upVotes: resource.upVotes,
        downVotes: resource.downVotes,
        userVote: null,
        isLoading: null, // Set initial loading state to null
      };
      return acc;
    }, {} as Record<string, { upVotes: number; downVotes: number; userVote: "upvote" | "downvote" | null; isLoading: "upvote" | "downvote" | null }>)
  );

  const handleVoteClick = async (resourceId: string, voteType: "upvote" | "downvote") => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [resourceId]: {
        ...prevVotes[resourceId],
        userVote: prevVotes[resourceId].userVote === voteType ? null : voteType, // Toggle or set the vote type
        upVotes: prevVotes[resourceId].userVote === "downvote" && voteType === "upvote"
          ? prevVotes[resourceId].upVotes + 1
          : prevVotes[resourceId].userVote === "upvote" && voteType === "downvote"
          ? prevVotes[resourceId].upVotes - 1
          : voteType === "upvote"
          ? prevVotes[resourceId].upVotes + 1
          : prevVotes[resourceId].upVotes,
        downVotes: prevVotes[resourceId].userVote === "upvote" && voteType === "downvote"
          ? prevVotes[resourceId].downVotes + 1
          : prevVotes[resourceId].userVote === "downvote" && voteType === "upvote"
          ? prevVotes[resourceId].downVotes - 1
          : voteType === "downvote"
          ? prevVotes[resourceId].downVotes + 1
          : prevVotes[resourceId].downVotes,
        isLoading: voteType, // Set loading state to the specific vote type
      },
    }));

    // Call the server action
    await handleVote({ resourceId, userId, voteType });

    // Reset the loading state after the server action completes
    setVotes((prevVotes) => ({
      ...prevVotes,
      [resourceId]: {
        ...prevVotes[resourceId],
        isLoading: null, // Reset loading state
      },
    }));
  };

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
                <a href={resource.slug} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {resource.name}
                </a>
                <div className="flex gap-2 items-center justify-center mt-2">
                  {/* Upvote Button */}
                  <button
                    className={`text-green-500 ${votes[resource.id].userVote === "upvote" ? "font-bold" : ""}`}
                    onClick={() => handleVoteClick(resource.id, "upvote")}
                    disabled={votes[resource.id].isLoading === "upvote"} // Disable while loading upvote
                  >
                    <ArrowUp
                      className={votes[resource.id].isLoading === "upvote" ? "animate-spin" : ""} // Apply spin only if upvote is loading
                    />
                    {votes[resource.id]?.upVotes}
                  </button>
                  {/* Downvote Button */}
                  <button
                    className={`text-red-500 ${votes[resource.id].userVote === "downvote" ? "font-bold" : ""}`}
                    onClick={() => handleVoteClick(resource.id, "downvote")}
                    disabled={votes[resource.id].isLoading === "downvote"} // Disable while loading downvote
                  >
                    <ArrowDown
                      className={votes[resource.id].isLoading === "downvote" ? "animate-spin" : ""} // Apply spin only if downvote is loading
                    />
                    {votes[resource.id]?.downVotes}
                  </button>
                </div>
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
