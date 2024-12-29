<?php
header('Content-Type: application/json; charset=utf-8');

require_once '../config.php';
require_once '../includes/SistemaTurnos.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    $tipoServicio = $_POST['tipo_servicio'] ?? '';
    $ventanilla = intval($_POST['ventanilla'] ?? 0);

    if (!in_array($tipoServicio, ['A', 'B', 'C', 'P']) || $ventanilla <= 0) {
        throw new Exception('Parámetros inválidos');
    }

    $sistema = new SistemaTurnos(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $ticket = $sistema->llamarSiguienteTicket($tipoServicio, $ventanilla);

    if ($ticket) {
        echo json_encode([
            'success' => true,
            'ticket' => $ticket
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No hay tickets en espera para este tipo de servicio'
        ]);
    }

} catch (Exception $e) {
    error_log("Error al llamar ticket: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

