<?php
$host = 'localhost';
$dbname = 'db_mlm';
$username = 'root';
$password = 'ABandara2001';

header('Content-Type: application/json');

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $empIds = json_decode(file_get_contents('php://input'), true);
    $phoneNumbers = [];

    $stmt = $conn->prepare("SELECT Phone FROM employees WHERE EmpNumber = :empId");

    foreach ($empIds as $empId) {
        // Ensure $empId is not an array
        if (is_array($empId)) {
            continue; // Skip this iteration if $empId is an array
        }

        $stmt->bindParam(':empId', $empId);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result && isset($result['Phone'])) {
            $phoneNumbers[] = $result['Phone'];
        }
    }

    echo json_encode(['phoneNumbers' => $phoneNumbers]);
} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
