<?php
require_once '../config.php';
require_once '../includes/SistemaTurnos.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ticketId = $_POST['ticket_id'] ?? '';
    
    if (empty($ticketId)) {
        echo json_encode(['error' => 'ID de ticket inválido']);
        exit;
    }
    
    $sistema = new SistemaTurnos(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $resultado = $sistema->finalizarAtencion($ticketId);
    
    if ($resultado) {
        echo json_encode(['message' => 'Atención finalizada correctamente']);
    } else {
        echo json_encode(['error' => 'No se pudo finalizar la atención']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}

