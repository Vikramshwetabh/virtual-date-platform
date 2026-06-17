import { MatchProfileView } from '@/components/dashboard/match-profile-view'

export default async function DiscoverProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <MatchProfileView matchId={id} />
}
