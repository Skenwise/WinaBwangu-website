<?php 
    $host = 'localhost'; // Database host
    $dbname = 'winabwangu'; //Database name
    $username = 'root'; //Databse username
    $password = ''; //Database password

    try {
        //Establish the database connection using PDO
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        //setting the PDO error mode to exception
        $pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        // if connection fails show error message
        echo 'Connection failed: '.$e->getMessage();
    }
?>