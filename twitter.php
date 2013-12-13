<?php
  require('twitteroauth.php');
  $consumerkey = 'qMZz1BA42m8c9Xc4luQQ';
  $consumersecret = 'Xk7FK5AnZphcufNZpuQYbBqbJAVPefDmI2qJPM3Q';
  $accesstoken = '463530223-nKLVJ3FSXuIghiEs07QitYdGS4IxGtf6S0AnF9ND';
  $accesssecret = 'r8Iap6quROqGpepsmzh3crWjF4GvoRfzF2WFWUfkLTc';
  #$q = $_GET['q'];
  $q = 'google';
  $twitter = new TwitterOAuth($consumerkey,$consumersecret,$accesstoken,$accesssecret);
  $tweets = $twitter->get('https://api.twitter.com/1.1/search/tweets.json?q=%40'.$q.'');
  #$url=$_GET['url'];
  # $url = 'http://198.211.114.151:443/cl';
  #$res = file_get_contents('http://'.$url);
  header('Content-type: application/json');
  //$r = json_encode($res);
  echo json_encode($tweets);

