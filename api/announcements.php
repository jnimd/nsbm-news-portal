<?php
// announcements and ticker api
require_once __DIR__ . '/../config/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query('SELECT * FROM announcements ORDER BY pinned DESC, id DESC');
        $announcements = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'data' => $announcements]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['title']) || empty($input['summary'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Title and summary are required']);
            break;
        }

        $title = trim($input['title']);
        $category = !empty($input['category']) ? trim($input['category']) : 'General';
        $badge = !empty($input['badge']) ? strtoupper(trim($input['badge'])) : 'GENERAL';
        $summary = trim($input['summary']);
        $pinned = !empty($input['pinned']) ? 1 : 0;
        $publishedDate = date('F d, Y');

        $stmt = $pdo->prepare('INSERT INTO announcements (title, category, badge, summary, pinned, published_date) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$title, $category, $badge, $summary, $pinned, $publishedDate]);

        echo json_encode(['status' => 'success', 'message' => 'Announcement published', 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        // Toggle pin or update
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required']);
            break;
        }

        if (isset($input['togglePin'])) {
            $stmt = $pdo->prepare('UPDATE announcements SET pinned = NOT pinned WHERE id = ?');
            $stmt->execute([(int)$input['id']]);
            echo json_encode(['status' => 'success', 'message' => 'Pin status updated']);
            break;
        }

        $stmt = $pdo->prepare('UPDATE announcements SET title = ?, category = ?, badge = ?, summary = ? WHERE id = ?');
        $stmt->execute([trim($input['title']), trim($input['category']), strtoupper(trim($input['badge'])), trim($input['summary']), (int)$input['id']]);
        echo json_encode(['status' => 'success', 'message' => 'Announcement updated']);
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID required']);
            break;
        }

        $stmt = $pdo->prepare('DELETE FROM announcements WHERE id = ?');
        $stmt->execute([(int)$_GET['id']]);
        echo json_encode(['status' => 'success', 'message' => 'Announcement deleted']);
        break;
}
