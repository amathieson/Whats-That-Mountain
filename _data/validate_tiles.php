<?php
$tiles = (array)json_decode(file_get_contents("processed_tiles.json"));

echo "Loaded " . sizeof($tiles) . " tiles\n";

foreach ($tiles as $id=>$tile) {
    if (!isset($tile->peaks) || isset($tile->error)) {
        echo "'$id' is missing data!\n";
        continue;
    }

    $a = array_filter($tile->peaks);
    $average = array_sum($a)/count($a);
    if (abs($tile->peak - $average) > 150) {
        echo "'$id' Peak∆ too high! - ";
        print_r($tile);
        continue;
    }

    $a = array_filter($tile->valleys);
    $average = array_sum($a)/count($tile->valleys);
    if (abs($tile->valley - $average) > 150) {
        echo "'$id' Valley∆ too high! - ";
        print_r($tile);
        continue;
    }

    unset($tile->valleys);
    unset($tile->peaks);
}

file_put_contents("compressed_tiles.json", json_encode($tiles));