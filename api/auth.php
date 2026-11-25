<?php
// user auth api (login and register)
require_once __DIR__ . '/../config/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($action === 'register') {
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Name, email, and password are required.']);
            exit;
        }

        $name = trim($data['name']);
        $email = strtolower(trim($data['email']));
        $password = $data['password'];
        $role = (!empty($data['role']) && $data['role'] === 'admin') ? 'admin' : 'student';
        $studentId = !empty($data['student_id']) ? trim($data['student_id']) : null;
        $adminId = !empty($data['admin_id']) ? trim($data['admin_id']) : null;
        $faculty = !empty($data['faculty']) ? trim($data['faculty']) : 'Faculty of Computing';
        $title = $role === 'admin' ? 'University Press Editor' : 'Student Journalist';

        // Check duplicate email
        $check = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $check->execute([$email]);
        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'An account with this email already exists.']);
            exit;
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        try {
            $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash, role, student_id, admin_id, faculty, title) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([$name, $email, $passwordHash, $role, $studentId, $adminId, $faculty, $title]);
            $userId = $pdo->lastInsertId();

            $user = [
                'id' => (int)$userId,
                'name' => $name,
                'email' => $email,
                'role' => $role,
                'student_id' => $studentId,
                'admin_id' => $adminId,
                'faculty' => $faculty,
                'title' => $title
            ];

            http_response_code(201);
            echo json_encode(['status' => 'success', 'message' => 'Registration successful', 'user' => $user]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        exit;
    }

    if ($action === 'login' || empty($action)) {
        $identifier = !empty($data['email']) ? strtolower(trim($data['email'])) : (!empty($data['username']) ? strtolower(trim($data['username'])) : '');
        $password = !empty($data['password']) ? $data['password'] : '';

        if (empty($identifier) || empty($password)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Username/email and password are required.']);
            exit;
        }

        try {
            $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? OR username = ?');
            $stmt->execute([$identifier, $identifier]);
            $user = $stmt->fetch();

            if (!$user) {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'Invalid username/email or password.']);
                exit;
            }

            // Strictly verify password using secure bcrypt hash
            $passValid = password_verify($password, $user['password_hash']);

            if (!$passValid) {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'Invalid username/email or password.']);
                exit;
            }

            // Remove password_hash before returning
            unset($user['password_hash']);

            echo json_encode([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => $user
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        exit;
    }
}

if ($method === 'GET') {
    // Current user lookup by ID
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
    if ($userId) {
        $stmt = $pdo->prepare('SELECT id, name, email, role, student_id, admin_id, faculty, title, created_at FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        if ($user) {
            echo json_encode(['status' => 'success', 'data' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
        }
        exit;
    }
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);

