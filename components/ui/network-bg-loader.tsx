'use client'

import dynamic from 'next/dynamic'

const NetworkBg = dynamic(
  () => import('@/components/ui/network-bg').then(mod => mod.NetworkBg),
  { ssr: false }
)

export function NetworkBgLoader() {
  return <NetworkBg />
}
