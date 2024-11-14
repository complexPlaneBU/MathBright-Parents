<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MathBright Leaderboard</title>
    <link rel="stylesheet" href="src/views/common_styles.css"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"> <!-- Font Awesome CDN -->

    
</head>
<body>
    

<div>
    <?php 
        echo '  token = ' . $token ;
     ?>
</div>


<div> verifyEmail View </div>

<div id="verifyEmailSection" data-state="<?= $token ?>">


</div>

    <script type="module" src="src/views/verifyEmail_view.js"></script> 

</body>
</html>

