<?php
ini_set('display_errors', '1');
ini_set('error_reporting', E_ALL);
$time_start = microtime(true);
$x = (int)$_GET["X"];
$y = $_GET["Y"];
$r = (float)$_GET["R"];
$result = checkPoints($x, $y, $r);
function checkPoints($x, $y, $r){
    bcscale(1000);
    $result = false;
    if (bccomp($y, -$x - $r / 2) != -1 && $x <= 0 && bccomp(0, $y) != -1) {
        $result = true;
    } else {
        if ($x >= 0 && bccomp(0, $y) != -1 && bccomp(pow($r, 2), bcadd(pow($x, 2), bcpow($y, 2))) != -1) {
            $result = true;
        } else {
            if (0 <= $x && $x <= $r && bccomp($y, 0) != -1 && bccomp($r / 2, $y) != -1) {
                $result = true;
            }
        }
    }
    return $result;
}

if ($result == false) {
    $result = 'false';
} else {
    $result = 'true';
}
$offset = parse_ini_file("prop.ini");
$time_zone = new DateTimeZone("+" . $offset["offset"] / 60);
$date = new DateTime("now", $time_zone);
$time_end = microtime(true);
$working_time = $time_end - $time_start;
echo "<td>" . $date->format("j.n.Y H:i:s") . "</td><td>" . $result . "</td> <td>" . $working_time . " sec</td>";
?>
