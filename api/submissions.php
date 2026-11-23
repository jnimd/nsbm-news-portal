<?php
// student submissions api
require_once __DIR__ . '/../config/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Optional filter by student_id
        if (!empty($_GET['student_id'])) {
            $stmt = $pdo->prepare('SELECT * FROM submissions WHERE student_id = ? ORDER BY id DESC');
            $stmt->execute([$_GET['student_id']]);
        } else {
            $stmt = $pdo->query('SELECT * FROM submissions ORDER BY id DESC');
        }
        $subs = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'data' => $subs]);
        break;

    case 'POST':
        // Student creates submission
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['title']) || empty($input['content'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Title and content required']);
            break;
        }

        $refId = 'sub-' . substr(time(), -5);
        $title = trim($input['title']);
        $category = !empty($input['category']) ? trim($input['category']) : 'Academic';
        $author = !empty($input['author']) ? trim($input['author']) : 'Student Contributor';
        $studentId = !empty($input['studentId']) ? trim($input['studentId']) : 'NSBM-STU-2026';
        $readTime = !empty($input['readTime']) ? trim($input['readTime']) : '4 min read';
        $image = !empty($input['image']) ? $input['image'] : '1im/ezgif-frame-001.jpg';
        $excerpt = !empty($input['excerpt']) ? trim($input['excerpt']) : substr(trim($input['content']), 0, 140) . '...';
        $content = trim($input['content']);
        $submittedDate = date('M d, Y');

        $stmt = $pdo->prepare('INSERT INTO submissions (ref_id, title, category, author_name, student_id, submitted_date, read_time, image_path, excerpt, content, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending")');
        $stmt->execute([$refId, $title, $category, $author, $studentId, $submittedDate, $readTime, $image, $excerpt, $content]);

        echo json_encode(['status' => 'success', 'message' => 'Article submitted for review', 'ref_id' => $refId]);
        break;

    case 'PUT':
        // Admin approves or rejects
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['id']) || empty($input['status'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'ID and decision status required']);
            break;
        }

        $id = (int)$input['id'];
        $status = in_array($input['status'], ['approved', 'rejected', 'pending']) ? $input['status'] : 'pending';
        $feedback = !empty($input['feedback']) ? trim($input['feedback']) : '';

        $stmt = $pdo->prepare('UPDATE submissions SET status = ?, feedback = ? WHERE id = ?');
        $stmt->execute([$status, $feedback, $id]);

        // If approved, automatically insert into articles!
        if ($status === 'approved') {
            $sel = $pdo->prepare('SELECT * FROM submissions WHERE id = ?');
            $sel->execute([$id]);
            $sub = $sel->fetch();

            if ($sub) {
                $catSlug = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $sub['category']));
                $ins = $pdo->prepare('INSERT INTO articles (title, category_name, category_slug, author_name, author_role, read_time, excerpt, content, image_path, featured, published_date) VALUES (?, ?, ?, ?, "Student Journalist", ?, ?, ?, ?, 0, ?)');
                $ins->execute([$sub['title'], $sub['category'], $catSlug, $sub['author_name'], $sub['read_time'], $sub['excerpt'], $sub['content'], $sub['image_path'], date('M d, Y')]);
            }
        }

        echo json_encode(['status' => 'success', 'message' => 'Submission status updated']);
        break;
}
