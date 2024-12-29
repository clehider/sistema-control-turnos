<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once '../../../includes/SistemaTurnos.php';
require_once '../../../config.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Método no permitido');
    }

    $sistema = new SistemaTurnos(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $tickets = $sistema->obtenerTickets();
    
    echo json_encode([
        'success' => true,
        'tickets' => $tickets
    ]);
} catch (Exception $e) {
    error_log("Error obteniendo tickets: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

