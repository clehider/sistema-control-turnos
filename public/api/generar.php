<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../../includes/SistemaTurnos.php';
require_once '../../../config.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $tipoServicio = $data['tipo_servicio'] ?? '';

    if (!in_array($tipoServicio, ['A', 'B', 'C', 'P'])) {
        throw new Exception('Tipo de servicio inválido');
    }

    $sistema = new SistemaTurnos(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $ticketId = $sistema->generarTicket($tipoServicio);

    echo json_encode([
        'success' => true,
        'ticket_id' => $ticketId
    ]);
} catch (Exception $e) {
    error_log("Error generando ticket: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

