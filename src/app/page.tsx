import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto p-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Sistema de Control de Turnos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/generar-ticket" className="block">
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">Generar Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Genera tickets para los clientes que llegan a solicitar atención
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin" className="block">
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-green-600">Panel de Administración</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Gestiona los tickets activos y las ventanillas de atención
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/monitor" className="block">
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-purple-600">Monitor de Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Visualiza los tickets actuales y en espera en tiempo real
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/estadisticas" className="block">
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-orange-600">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Consulta estadísticas y métricas del sistema
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
