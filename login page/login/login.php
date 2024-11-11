<?php

ini_set('display_errors', 1);  // Show errors
error_reporting(E_ALL);  // Report all errors

session_start();
include '../database_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $query = 'SELECT * FROM customers WHERE Username = ?';
    $stmt = $pdo->prepare($query);
    $stmt -> execute([$username]);
    $user = $stmt -> fetch();

    if ($user && password_verify($password, $user['PasswordHash'])) {
        $_SESSION['user'] = $user['CustomerID'];
        
        // Redirect to winabwangu website
        header('Location: ../../clientside.html');
        exit(); // closed the header after the script
    } else { 
        echo 'Invalid username or password';
    }
}

?>