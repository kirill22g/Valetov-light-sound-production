<?php
// Измените этот email на вашу реальную почту
$to = "csgotap777@gmail.com"; 
$subject = "Новая заявка с сайта VALETOV Production";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Очистка данных
    $name = strip_tags(trim($_POST["name"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $service = strip_tags(trim($_POST["service"]));
    $message_text = strip_tags(trim($_POST["message"]));

    // Формирование тела письма
    $message = "Новая заявка с сайта:\n\n";
    $message .= "Имя: " . $name . "\n";
    $message .= "Телефон: " . $phone . "\n";
    $message .= "Услуга: " . $service . "\n";
    if(!empty($message_text)){
        $message .= "Детали: " . $message_text . "\n";
    }

    $headers = "From: kirill22g@icloud.com" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Reply-To: kirill22g@icloud.com" . $_SERVER['HTTP_HOST'] . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($to, $subject, $message, $headers)) {
        http_response_code(200);
        echo "Success";
    } else {
        http_response_code(500);
        echo "Error";
    }
} else {
    http_response_code(403);
    echo "Forbidden";
}
?>