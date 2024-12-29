<?php
require_once '../config.php';
require_once '../includes/SistemaTurnos.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sistema = new SistemaTurnos(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $estadoPanel = $sistema->obtenerEstadoPanel();
    
    echo json_encode($estadoPanel);
} else {
    echo json_encode(['error' => 'Método no permitido']);
}

