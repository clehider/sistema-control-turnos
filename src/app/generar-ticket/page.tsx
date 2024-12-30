'use client'

import { TicketGenerator } from '@/components/TicketGenerator'

export default function GenerarTicketPage() {
  const handleTicketGenerated = (ticketNumber: string) => {
    console.log(`Ticket generado: ${ticketNumber}`);
    // Aquí puedes agregar lógica adicional si es necesario
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Generar Ticket</h1>
      <TicketGenerator onTicketGenerated={handleTicketGenerated} />
    </main>
  )
}
