'use client';

import { use } from 'react';
// Replace with the actual import path to your existing Match Profile UI
// import { MatchProfileView } from '@/components/matches/match-profile-view';

export default function MatchProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="p-8">Match Profile UI for user ID: {id} goes here</div>
    // <MatchProfileView matchId={id} />
  );
}