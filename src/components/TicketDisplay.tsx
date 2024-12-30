import React from 'react';

interface TicketDisplayProps {
  lastTicket: string | null;
}

export function TicketDisplay({ lastTicket }: TicketDisplayProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Último ticket generado:</h2>
      <p className="text-3xl font-bold text-blue-600">
        {lastTicket || 'Ningún ticket generado aún'}
      </p>
    </div>
  );
}
