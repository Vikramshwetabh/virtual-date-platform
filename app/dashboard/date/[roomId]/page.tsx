'use client'

import { use } from 'react'
import { ActiveDateView } from '@/components/dashboard/active-date-view'

export default function ActiveDateRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params)

  return <ActiveDateView roomId={roomId} />
}
