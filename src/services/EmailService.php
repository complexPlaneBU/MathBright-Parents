<?php
// EmailService.php


// Fetch the email password from environment variables
$emailPassword = getenv('EMAIL_PASSWORD');

// Require PHPMailer classes
require 'phpMailer/src/Exception.php';
require 'phpMailer/src/PHPMailer.php';
require 'phpMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
      
class EmailService
{
    private $config;

    public function __construct()
    {
        $this->config = json_decode(file_get_contents('./src/config/emailConfig.json'), true);
    }

    public function sendEmail($toEmail, $toName, $ccEmails, $subject, $body, $altBody)
    {
        try {
            $mail = $this->configureMailer();
            $this->setRecipients($mail, $toEmail, $toName, $ccEmails);
            $this->setContent($mail, $subject, $body, $altBody);
            $mail->send();

            return json_encode(['status' => 'success', 'message' => 'Email sent successfully']);
        } catch (Exception $e) {
            return json_encode(['status' => 'error', 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
        }
    }

    private function configureMailer()
    {
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = $this->getConfigValue('mailer.host');
        $mail->SMTPAuth = $this->getConfigValue('mailer.smtp_auth');
        $mail->Port = $this->getConfigValue('mailer.port');
        $mail->Username = $this->getConfigValue('mailer.username');
        $mail->Password = $this->getConfigValue('mailer.password');
        $mail->setFrom($this->getConfigValue('mailer.from_email'), $this->getConfigValue('mailer.from_name'));

        return $mail;
    }

    private function setRecipients($mail, $toEmail, $toName, $ccEmails)
    {
        $mail->addAddress($toEmail, $toName);

        if (!empty($ccEmails)) {
            // Ensure $ccEmails is an array
            if (is_string($ccEmails)) {
                $ccEmails = explode(',', $ccEmails); // Convert comma-separated string to array
            }

            if (is_array($ccEmails)) {
                foreach ($ccEmails as $ccEmail) {
                    // Trim each email address to avoid issues with extra spaces
                    $ccEmail = trim($ccEmail);
                    if (!empty($ccEmail)) {
                        $mail->addCC($ccEmail);
                    }
                }
            } else {
                throw new InvalidArgumentException('CC Emails should be an array or a comma-separated string.');
            }
        }
    }

    private function setContent($mail, $subject, $body, $altBody)
    {
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = $altBody;
    }

    private function getConfigValue($key)
    {
        $keys = explode('.', $key);
        $value = $this->config;

        foreach ($keys as $k) {
            if (!isset($value[$k])) {
                return null;
            }
            $value = $value[$k];
        }

        return $value;
    }
}

// Get POST data (ensure your AJAX sends this data as JSON)
//$data = json_decode(file_get_contents('php://input'), true);

// Set header for JSON response
//header('Content-Type: application/json');
//header('Cache-Control: no-cache, must-revalidate'); // Disable caching
//header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past

// Call the function and echo the result
//$emailService = new EmailService();
//echo $emailService->sendEmail('chizzy.u@hotmail.com', 'Chizzy', 'chizzy.du@gmail.com', 'Reward Claimed 7', 'Username Claimed a Reward', 'reward claimed');
?>


