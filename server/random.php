<?php

$numbers = array();

for ($i = 0; $i < 10; $i++)
{
	// sets a test boolean
	$ok = false;

	// as long as that boolean remains false, we're not going anywhere...
	while($ok == false)
	{
		// generate a random number
		$rand = rand(0, 100); // chose 5 because I want to give each cell enough background to be visible

		// if that number is not in the array already...
		if (!in_array($rand, $numbers))
		{
			// add it to the array
			array_push($numbers, $rand);
			// set the boolean to true so we can loop back through again
			$ok = true;
		}
		// no else statement needed - if it fails the above conditional, the while will loop us back through again until we get it right.
	}
}

echo(json_encode($numbers));