<?php
header('Content-Type: application/json');

// Simulate receiving data from the JavaScript
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['phoneNumbers']) || !isset($data['message'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing phone numbers or message']);
    exit;
}

$phoneNumbers = $data['phoneNumbers'];
$message = $data['message'];

// Simulate processing (In a real scenario, you would send the SMS here)
foreach ($phoneNumbers as $phoneNumber) {
    // Simulate sending SMS to each phone number
    // In a real application, integrate with an SMS API here
    file_put_contents('sms_log.txt', "Sending message to $phoneNumber: $message\n", FILE_APPEND);
}

// Respond with a success message
echo json_encode(['status' => 'success', 'message' => 'SMS sent successfully']);
?>
