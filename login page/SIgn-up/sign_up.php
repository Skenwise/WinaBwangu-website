<?php

include '../database_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    

    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $query = "INSERT INTO   customers (Username, Email, PasswordHash) Values (?,?,?)";
    $stmt = $pdo->prepare($query);
    $stmt -> execute([$username, $email, $password]);

    echo "Sign-up successful!";

}
?>