'use client'

import { TicketGenerator } from '@/components/TicketGenerator'

export default function GenerarTicketPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Generar Ticket</h1>
      <TicketGenerator />
    </main>
  )
}
