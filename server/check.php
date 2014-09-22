<?php

// get the post input
$array = json_decode(file_get_contents("php://input"), true);

// set a value that thinks the array is sorted, until it's proven that it's not.
$sorted = true;

// loop through the array
for ($i = 0; $i < count($array) - 1; $i++) {
	// if the current value is less than the next value
	if ($array[$i] < $array[$i+1]) {
		// the array is not sorted
		$sorted = false;
		break;
	}
}

// send the results back to the front end
echo $sorted;
