<?php
$title=$_GET['title'];
$desc=$_GET['desc'];
$img=$_GET['image'];
?>
<body style="textalign:left">
<center>
<h1> <?php echo $title;?></h1><br/>
<img src=<?php echo $img;?>></br>
<h3> <?php echo $desc;?><h3>
</center>
</body>