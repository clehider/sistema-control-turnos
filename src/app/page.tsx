'use client'

import { TicketGenerator } from '@/components/TicketGenerator'
import { TicketDisplay } from '@/components/TicketDisplay'
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const handleTicketGenerated = (ticketId: string, ticketNumber: string) => {
    console.log('Ticket generado:', ticketId, ticketNumber)
    toast({
      title: "Ticket generado",
      description: `Número de ticket: ${ticketNumber}`,
    })
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Sistema de Control de Turnos</h1>
      <TicketGenerator onTicketGenerated={handleTicketGenerated} />
      <div className="mt-8">
        <TicketDisplay />
      </div>
      <Toaster />
    </main>
  )
}
