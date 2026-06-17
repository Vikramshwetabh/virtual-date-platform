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
