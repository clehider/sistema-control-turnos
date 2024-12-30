'use client'

import { useState } from 'react'
import { TicketGenerator } from '@/components/TicketGenerator'
import { TicketDisplay } from '@/components/TicketDisplay'

export default function Home() {
  const [lastGeneratedTicket, setLastGeneratedTicket] = useState<string | null>(null)

  const handleTicketGenerated = (ticketNumber: string) => {
    setLastGeneratedTicket(ticketNumber)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Sistema de Control de Turnos</h1>
      <TicketGenerator onTicketGenerated={handleTicketGenerated} />
      <div className="mt-8">
        <TicketDisplay lastTicket={lastGeneratedTicket} />
      </div>
    </main>
  )
}
