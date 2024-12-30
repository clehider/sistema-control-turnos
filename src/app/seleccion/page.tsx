'use client'

import { useToast } from "@/components/ui/use-toast"

export default function SeleccionPage() {
  const { toast } = useToast()

  const handleClick = () => {
    toast({
      title: "Scheduled: Catch up",
      description: "Friday, February 10, 2023 at 5:57 PM",
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Selección</h1>
      <button 
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Toast
      </button>
    </div>
  )
}
