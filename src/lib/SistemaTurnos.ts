import mysql from 'serverless-mysql'

export class SistemaTurnos {
  private conn: ReturnType<typeof mysql>

  constructor(host: string, user: string, password: string, database: string) {
    this.conn = mysql({
      config: {
        host,
        user,
        password,
        database,
      },
    })
  }

  async generarTicket(tipoServicio: string): Promise<string> {
    try {
      await this.conn.query('START TRANSACTION')

      const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const [maxNumResult] = await this.conn.query(
        'SELECT MAX(CAST(numero AS UNSIGNED)) as max_num FROM tickets WHERE DATE(hora_emision) = CURDATE() AND tipo_servicio = ?',
        [tipoServicio]
      )

      const maxNum = maxNumResult.max_num || 0
      const numero = String(maxNum + 1).padStart(4, '0')
      const id = `${fecha}${tipoServicio}${numero}`

      await this.conn.query(
        'INSERT INTO tickets (id, numero, tipo_servicio, hora_emision, estado) VALUES (?, ?, ?, NOW(), ?)',
        [id, numero, tipoServicio, 'espera']
      )

      await this.conn.query('COMMIT')
      console.log(`Ticket generado exitosamente: ${id}`)
      return id
    } catch (error) {
      await this.conn.query('ROLLBACK')
      console.error('Error generando ticket:', error)
      throw error
    } finally {
      await this.conn.end()
    }
  }
}
