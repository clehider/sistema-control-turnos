'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface TicketGeneratorProps {
  onTicketGenerated: (ticketNumber: string) => void;
}

export function TicketGenerator({ onTicketGenerated }: TicketGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateTicket = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-ticket', {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Error al generar el ticket')
      }
      const data = await response.json()
      onTicketGenerated(data.ticketNumber)
      toast({
        title: "Ticket generado",
        description: `Número de ticket: ${data.ticketNumber}`,
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar el ticket. Por favor, intente de nuevo.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Button 
        onClick={generateTicket} 
        disabled={isGenerating}
        className="px-6 py-3 text-lg"
      >
        {isGenerating ? 'Generando...' : 'Generar Ticket'}
      </Button>
    </div>
  )
}
