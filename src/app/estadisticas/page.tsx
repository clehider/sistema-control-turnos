'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Estadisticas {
  tiempoPromedioAtencion: number | null;
  ticketsPorTipo: { [key: string]: number };
  rendimientoPorVentanilla: { [key: number]: number };
}

export default function EstadisticasPage() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    tiempoPromedioAtencion: null,
    ticketsPorTipo: {},
    rendimientoPorVentanilla: {}
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await fetch('/api/estadisticas')
        if (!response.ok) {
          throw new Error('Error al obtener estadísticas')
        }
        const data = await response.json()
        setEstadisticas(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching estadísticas:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchEstadisticas()
    const interval = setInterval(fetchEstadisticas, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Cargando estadísticas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    )
  }

  const ticketsPorTipoData = Object.entries(estadisticas.ticketsPorTipo || {}).map(([tipo, cantidad]) => ({
    tipo: getTipoServicio(tipo),
    cantidad: cantidad || 0
  }))

  const rendimientoPorVentanillaData = Object.entries(estadisticas.rendimientoPorVentanilla || {}).map(([ventanilla, cantidad]) => ({
    ventanilla: `Ventanilla ${ventanilla}`,
    cantidad: cantidad || 0
  }))

  const totalTickets = Object.values(estadisticas.ticketsPorTipo || {}).reduce((sum, current) => sum + (current || 0), 0)

  const ventanillaMasActiva = Object.entries(estadisticas.rendimientoPorVentanilla || {}).reduce((max, current) => {
    return (max[1] || 0) > (current[1] || 0) ? max : current
  }, ['0', 0])[0]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Estadísticas del Sistema</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Tiempo Promedio de Atención</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {estadisticas.tiempoPromedioAtencion != null && !isNaN(estadisticas.tiempoPromedioAtencion) 
                ? `${Number(estadisticas.tiempoPromedioAtencion).toFixed(2)} min`
                : 'Sin datos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {totalTickets > 0 ? totalTickets : 'Sin datos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ventanilla más Activa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {ventanillaMasActiva !== '0' ? `Ventanilla ${ventanillaMasActiva}` : 'Sin datos'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Tipo de Servicio</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {ticketsPorTipoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsPorTipoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Ventanilla</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {rendimientoPorVentanillaData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rendimientoPorVentanillaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ventanilla" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cantidad" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No hay datos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function getTipoServicio(tipo: string): string {
  const tipos = {
    'A': 'Atención General',
    'B': 'Servicios Empresariales',
    'C': 'Clientes Preferenciales',
    'P': 'Atención Prioritaria'
  }
  return tipos[tipo as keyof typeof tipos] || tipo
}
