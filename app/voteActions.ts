// app/actions/voteActions.ts
"use server";

import prisma from '@/app/utils/db';

interface VoteActionInput {
  resourceId: string;
  userId: string;
  voteType: "upvote" | "downvote"; // Type of vote: upvote or downvote
}

export async function handleVote({ resourceId, userId, voteType }: VoteActionInput) {
  // Find the existing vote for this user on this resource
  const previousVote = await prisma.resourceVote.findUnique({
    where: { resourceId_userId: { resourceId, userId } },
  });

  if (previousVote) {
    // If the same vote type is clicked again, remove the vote
    if (previousVote.voteType === voteType) {
      await prisma.resourceVote.delete({
        where: { resourceId_userId: { resourceId, userId } },
      });
      // Adjust upVotes or downVotes accordingly
      await prisma.resource.update({
        where: { id: resourceId },
        data: {
          upVotes: voteType === "upvote" ? { decrement: 1 } : undefined,
          downVotes: voteType === "downvote" ? { decrement: 1 } : undefined,
        },
      });
      return; // No further action required
    } else {
      // If switching from upvote to downvote or vice versa
      await prisma.resourceVote.update({
        where: { resourceId_userId: { resourceId, userId } },
        data: { voteType },
      });
      await prisma.resource.update({
        where: { id: resourceId },
        data: {
          upVotes: voteType === "upvote" ? { increment: 1 } : { decrement: 1 },
          downVotes: voteType === "downvote" ? { increment: 1 } : { decrement: 1 },
        },
      });
    }
  } else {
    // Create a new vote if no prior vote exists
    await prisma.resourceVote.create({
      data: { resourceId, userId, voteType },
    });
    await prisma.resource.update({
      where: { id: resourceId },
      data: {
        upVotes: voteType === "upvote" ? { increment: 1 } : undefined,
        downVotes: voteType === "downvote" ? { increment: 1 } : undefined,
      },
    });
  }
}
