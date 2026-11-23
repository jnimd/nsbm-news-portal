<?php
// categories api
require_once __DIR__ . '/../config/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query('SELECT * FROM categories ORDER BY id ASC');
            $categories = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $categories]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['name'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Category name is required.']);
            exit;
        }

        $name = trim($data['name']);
        $slug = !empty($data['slug']) ? strtolower(trim($data['slug'])) : strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $name));
        $icon = !empty($data['icon']) ? trim($data['icon']) : 'general';
        $color = !empty($data['color']) ? trim($data['color']) : '#3b82f6';
        $desc = !empty($data['description']) ? trim($data['description']) : '';

        try {
            $stmt = $pdo->prepare('INSERT INTO categories (slug, name, icon, color, description) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$slug, $name, $icon, $color, $desc]);
            $newId = $pdo->lastInsertId();

            $fetch = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
            $fetch->execute([$newId]);
            $newCat = $fetch->fetch();

            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Category created', 'data' => $newCat]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Category ID is required']);
            exit;
        }

        try {
            $stmt = $pdo->prepare('DELETE FROM categories WHERE id = ?');
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Category deleted']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
