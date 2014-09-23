<?php

// get the post input
$pair = json_decode(file_get_contents("php://input"), true);

// store them in temporary variables
$first = $pair[0];
$second = $pair[1];

$return = array();

// run analysis
if ($second > $first)
{
	$return[0] = $second;
	$return[1] = $first;
	// send back to the front-end
	echo json_encode($return);
	unset($return);
} else {
	echo json_encode($pair);
	unset($pair);
}

