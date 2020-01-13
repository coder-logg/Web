<?php
     $offset = (int)$_GET["offset"];
    if ($offset < 0) {
        $offset = -$offset;
    }
    file_put_contents("prop.ini","offset = ".$offset);
    echo timezone_name_from_abbr("",$offset*60,0);
?>