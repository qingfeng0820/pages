<?php

  require 'phpmailer/PHPMailerAutoload.php';
  // if(isset($_POST['sendMessage']))
  //     {
        $customer_name = $_POST['customerName']; 
        $customer_email = $_POST['customerEmail'];                    
        $message_subject = $_POST['messageSubject'];
        $message_content = $_POST['messageContent'];

        // config
        $email = "xxxx@gmail.com";                    
        $password = "xxxx";
        $to_email = "xxxx@gmail.com";
        $subject = "[Customer Message] " . $message_subject;
        $message = $message_content . "<br /><br /><br />" . "From " . $customer_name . "[" . $customer_email ."]";
        // config end

        $mail = new PHPMailer;

        $mail->isSMTP();

        $mail->Host = 'smtp.gmail.com';

        $mail->Port = 587;

        $mail->SMTPSecure = 'tls';

        $mail->SMTPAuth = true;

        $mail->Username = $email;

        $mail->Password = $password;

        $mail->setFrom($email, "Customer's Message");

        $mail->addReplyTo($customer_email, $customer_name);

        $mail->addAddress($to_email);

        $mail->Subject = $subject;

        $mail->msgHTML($message);

        if (!$mail->send()) {
            
            $error = "Mailer Error: " . $mail->ErrorInfo;
            /*
            ?><script>alert('<?php echo $error ?>');</script><?php
            */
           echo $error;
        } 
        else {
           // echo '<script>alert("Message sent!");</script>';
            echo 0;
        }
   // } else {
   //   echo 1;
   // }
?>

