<?php
  $url=$_GET['url'];
  # $url = 'http://198.211.114.151:443/cl';
  $res = file_get_contents('http://'.$url);
  header('Content-type: application/json');
  //$r = json_encode($res);
  print_r($res);
?>
