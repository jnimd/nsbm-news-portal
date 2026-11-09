<?php
// comments api
require_once __DIR__ . '/../config/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Optional filter by article_id
        try {
            if (isset($_GET['article_id'])) {
                $stmt = $pdo->prepare('SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC');
                $stmt->execute([(int)$_GET['article_id']]);
            } else {
                // All comments (for admin moderation panel)
                $stmt = $pdo->query('SELECT c.*, a.title AS article_title FROM comments c LEFT JOIN articles a ON c.article_id = a.id ORDER BY c.created_at DESC');
            }
            $comments = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $comments]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['article_id']) || empty($data['author_name']) || empty($data['comment_text'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'article_id, author_name, and comment_text are required']);
            exit;
        }

        $articleId = (int)$data['article_id'];
        $userId = !empty($data['user_id']) ? (int)$data['user_id'] : null;
        $authorName = trim($data['author_name']);
        $userRole = !empty($data['user_role']) ? trim($data['user_role']) : 'Student Reader';
        $commentText = trim($data['comment_text']);

        try {
            $stmt = $pdo->prepare('INSERT INTO comments (article_id, user_id, author_name, user_role, comment_text, status) VALUES (?, ?, ?, ?, ?, ?)');
            $stmt->execute([$articleId, $userId, $authorName, $userRole, $commentText, 'approved']);
            $newId = $pdo->lastInsertId();

            $fetch = $pdo->prepare('SELECT * FROM comments WHERE id = ?');
            $fetch->execute([$newId]);
            $newComment = $fetch->fetch();

            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Comment posted successfully', 'data' => $newComment]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update moderation status (e.g. approved, flagged, removed)
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['id']) || empty($data['status'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Comment id and status are required']);
            exit;
        }

        $id = (int)$data['id'];
        $status = in_array($data['status'], ['approved', 'flagged', 'removed'], true) ? $data['status'] : 'approved';

        try {
            $stmt = $pdo->prepare('UPDATE comments SET status = ? WHERE id = ?');
            $stmt->execute([$status, $id]);
            echo json_encode(['status' => 'success', 'message' => "Comment status updated to $status"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Comment ID is required']);
            exit;
        }

        try {
            $stmt = $pdo->prepare('DELETE FROM comments WHERE id = ?');
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success', 'message' => 'Comment deleted']);
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
