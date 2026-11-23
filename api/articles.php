<?php
// articles crud and search api
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
        // Optional ID parameter
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare('SELECT * FROM articles WHERE id = ?');
            $stmt->execute([(int)$_GET['id']]);
            $article = $stmt->fetch();
            if ($article) {
                // Increment views
                $up = $pdo->prepare('UPDATE articles SET views = views + 1 WHERE id = ?');
                $up->execute([(int)$_GET['id']]);
                echo json_encode(['status' => 'success', 'data' => $article]);
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Article not found']);
            }
            break;
        }

        // Filters: category, search, date
        $query = 'SELECT * FROM articles WHERE 1=1';
        $params = [];

        if (!empty($_GET['category']) && $_GET['category'] !== 'all') {
            $query .= ' AND (LOWER(category_name) = ? OR LOWER(category_slug) = ?)';
            $catLower = strtolower($_GET['category']);
            $params[] = $catLower;
            $params[] = $catLower;
        }

        if (!empty($_GET['search'])) {
            $query .= ' AND (title LIKE ? OR excerpt LIKE ? OR author_name LIKE ?)';
            $searchWild = '%' . $_GET['search'] . '%';
            $params[] = $searchWild;
            $params[] = $searchWild;
            $params[] = $searchWild;
        }

        if (!empty($_GET['date'])) {
            $query .= ' AND DATE(created_at) = ?';
            $params[] = $_GET['date'];
        }

        $query .= ' ORDER BY id DESC';

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $articles = $stmt->fetchAll();

        echo json_encode(['status' => 'success', 'data' => $articles]);
        break;

    case 'POST':
        // Create Article (Admin)
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['title']) || empty($input['content'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Headline and full content required']);
            break;
        }

        $title = trim($input['title']);
        $catName = !empty($input['category']) ? $input['category'] : 'General';
        $catSlug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $catName));
        $author = !empty($input['author']) ? trim($input['author']) : 'Editorial Desk';
        $authorRole = !empty($input['authorRole']) ? trim($input['authorRole']) : 'Staff Writer';
        $readTime = !empty($input['readTime']) ? trim($input['readTime']) : '4 min read';
        $excerpt = !empty($input['excerpt']) ? trim($input['excerpt']) : substr(trim($input['content']), 0, 160) . '...';
        $content = trim($input['content']);
        $image = !empty($input['image']) ? $input['image'] : '1im/ezgif-frame-001.jpg';
        $featured = !empty($input['featured']) ? 1 : 0;
        $publishedDate = date('M d, Y');

        $stmt = $pdo->prepare('INSERT INTO articles (title, category_name, category_slug, author_name, author_role, read_time, excerpt, content, image_path, featured, published_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$title, $catName, $catSlug, $author, $authorRole, $readTime, $excerpt, $content, $image, $featured, $publishedDate]);

        $newId = $pdo->lastInsertId();
        echo json_encode(['status' => 'success', 'message' => 'Article published', 'id' => $newId]);
        break;

    case 'PUT':
        // Update Article (Admin)
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Article ID required']);
            break;
        }

        $id = (int)$input['id'];
        $title = trim($input['title']);
        $catName = !empty($input['category']) ? $input['category'] : 'General';
        $catSlug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $catName));
        $author = !empty($input['author']) ? trim($input['author']) : 'Editorial Desk';
        $readTime = !empty($input['readTime']) ? trim($input['readTime']) : '4 min read';
        $excerpt = !empty($input['excerpt']) ? trim($input['excerpt']) : '';
        $content = trim($input['content']);
        $image = !empty($input['image']) ? $input['image'] : '1im/ezgif-frame-001.jpg';
        $featured = !empty($input['featured']) ? 1 : 0;

        $stmt = $pdo->prepare('UPDATE articles SET title = ?, category_name = ?, category_slug = ?, author_name = ?, read_time = ?, excerpt = ?, content = ?, image_path = ?, featured = ? WHERE id = ?');
        $stmt->execute([$title, $catName, $catSlug, $author, $readTime, $excerpt, $content, $image, $featured, $id]);

        echo json_encode(['status' => 'success', 'message' => 'Article updated']);
        break;

    case 'DELETE':
        // Delete Article (Admin)
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Article ID required']);
            break;
        }

        $stmt = $pdo->prepare('DELETE FROM articles WHERE id = ?');
        $stmt->execute([(int)$_GET['id']]);

        echo json_encode(['status' => 'success', 'message' => 'Article deleted']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}
