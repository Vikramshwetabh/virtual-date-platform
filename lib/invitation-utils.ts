import { users } from '@/lib/api'
import type { ApiInvitation, EnrichedInvitation } from '@/lib/types/api'

export async function enrichInvitationsWithSenders(
  invitations: ApiInvitation[],
): Promise<EnrichedInvitation[]> {
  const senderIds = [...new Set(invitations.map((invitation) => invitation.senderId))]

  const profiles = await Promise.all(
    senderIds.map((id) =>
      users.getProfile(id).catch(() => null),
    ),
  )

  const sendersById = new Map(
    senderIds
      .map((id, index) => [id, profiles[index]] as const)
      .filter(([, profile]) => profile != null),
  )

  return invitations.map((invitation) => {
    const sender = sendersById.get(invitation.senderId)
    return {
      ...invitation,
      sender: sender
        ? {
            id: sender.id,
            name: sender.name,
            avatar: sender.avatar ?? undefined,
            bio: sender.bio,
          }
        : undefined,
    }
  })
}

export async function enrichInvitations(
  invitations: ApiInvitation[],
  currentUserId: string,
): Promise<EnrichedInvitation[]> {
  const otherUserIds = [
    ...new Set(
      invitations.map((inv) =>
        inv.senderId === currentUserId ? inv.receiverId : inv.senderId
      )
    )
  ]

  const profiles = await Promise.all(
    otherUserIds.map((id) =>
      users.getProfile(id).catch(() => null),
    ),
  )

  const profilesById = new Map(
    otherUserIds
      .map((id, index) => [id, profiles[index]] as const)
      .filter(([, profile]) => profile != null),
  )

  return invitations.map((invitation) => {
    const otherId = invitation.senderId === currentUserId ? invitation.receiverId : invitation.senderId
    const otherUser = profilesById.get(otherId)
    return {
      ...invitation,
      sender: otherUser
        ? {
            id: otherUser.id,
            name: otherUser.name,
            avatar: otherUser.avatar ?? undefined,
            bio: otherUser.bio,
          }
        : undefined,
    }
  })
}
