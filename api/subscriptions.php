<?php
// bookmarks and subscriptions api
require_once __DIR__ . '/../config/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$type = isset($_GET['type']) ? $_GET['type'] : 'categories'; // 'categories' or 'bookmarks'

switch ($method) {
    case 'GET':
        $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 1;

        if ($type === 'bookmarks') {
            try {
                $stmt = $pdo->prepare('
                    SELECT b.id AS bookmark_id, b.created_at AS bookmarked_at, a.* 
                    FROM bookmarks b 
                    JOIN articles a ON b.article_id = a.id 
                    WHERE b.user_id = ?
                    ORDER BY b.created_at DESC
                ');
                $stmt->execute([$userId]);
                $bookmarks = $stmt->fetchAll();
                echo json_encode(['status' => 'success', 'data' => $bookmarks]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
            break;
        }

        // Default: category subscriptions
        try {
            $stmt = $pdo->prepare('SELECT category_slug FROM category_subscriptions WHERE user_id = ?');
            $stmt->execute([$userId]);
            $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
            echo json_encode(['status' => 'success', 'data' => $rows]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || empty($data['user_id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'user_id is required']);
            exit;
        }

        $userId = (int)$data['user_id'];

        if ($type === 'bookmarks') {
            if (empty($data['article_id'])) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'article_id is required']);
                exit;
            }
            $articleId = (int)$data['article_id'];

            try {
                // Check if already bookmarked
                $check = $pdo->prepare('SELECT id FROM bookmarks WHERE user_id = ? AND article_id = ?');
                $check->execute([$userId, $articleId]);
                $existing = $check->fetch();

                if ($existing) {
                    // Toggle off (remove)
                    $del = $pdo->prepare('DELETE FROM bookmarks WHERE id = ?');
                    $del->execute([$existing['id']]);
                    echo json_encode(['status' => 'success', 'bookmarked' => false, 'message' => 'Bookmark removed']);
                } else {
                    // Toggle on (add)
                    $ins = $pdo->prepare('INSERT INTO bookmarks (user_id, article_id) VALUES (?, ?)');
                    $ins->execute([$userId, $articleId]);
                    echo json_encode(['status' => 'success', 'bookmarked' => true, 'message' => 'Article bookmarked']);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
            }
            break;
        }

        // Category Subscription Toggle
        if (empty($data['category_slug'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'category_slug is required']);
            exit;
        }

        $slug = strtolower(trim($data['category_slug']));

        try {
            $check = $pdo->prepare('SELECT id FROM category_subscriptions WHERE user_id = ? AND category_slug = ?');
            $check->execute([$userId, $slug]);
            $existing = $check->fetch();

            if ($existing) {
                $del = $pdo->prepare('DELETE FROM category_subscriptions WHERE id = ?');
                $del->execute([$existing['id']]);
                echo json_encode(['status' => 'success', 'subscribed' => false, 'message' => "Unsubscribed from $slug"]);
            } else {
                $ins = $pdo->prepare('INSERT INTO category_subscriptions (user_id, category_slug) VALUES (?, ?)');
                $ins->execute([$userId, $slug]);
                echo json_encode(['status' => 'success', 'subscribed' => true, 'message' => "Subscribed to $slug notifications"]);
            }
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
