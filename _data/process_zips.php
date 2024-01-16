<?php
$_source_dir = "/home/adam/NASA_DEM";
require 'vendor/autoload.php';
use Symfony\Component\Dotenv\Dotenv;

$dotenv = new Dotenv();
$dotenv->load(__DIR__.'/.env');

$bucket_name        = $_ENV['CF_Bucket'];
$account_id         = $_ENV['CF_Account_ID'];
$access_key_id      = $_ENV['CF_Access_ID'];
$access_key_secret  = $_ENV['CF_Access_Key'];

$credentials = new Aws\Credentials\Credentials($access_key_id, $access_key_secret);

$options = [
    'region' => 'auto',
    'endpoint' => $_ENV['CF_R2_Endpoint'],
    'version' => 'latest',
    'credentials' => $credentials
];

$s3_client = new Aws\S3\S3Client($options);
$pastFiles = [];
if (file_exists("_log.files"))
    $pastFiles = explode("\n", file_get_contents("_log.files"));

$log = fopen("_log.files", "a");
try {
    $files = glob($_source_dir . "/*.zip");
    $counter = 0;
    foreach ($files as $file) {
        if (!in_array($file, $pastFiles)) {
            $tile = substr(explode("NASADEM_HGT_", $file)[1], 0, -4);
            $path = "zip://" . $file . "#$tile.hgt";
            $original = file_get_contents($path);
            $compress = gzcompress($original);

            // Use putObject to upload the object
            try {
                $res = $s3_client->putObject([
                    'Bucket' => $bucket_name,
                    'Key' => $tile . ".hgt.gz",
                    'Body' => $compress
                ]);

                // If no exception is thrown, the object was uploaded successfully
                echo PHP_EOL . "$tile: " . strlen($compress) . " / " . strlen($original) . "b - " . (1 - strlen($compress) / strlen($original))*100 . "% saving";
                echo "Object uploaded successfully. ETag: " . $res['ETag'] . PHP_EOL;
                fwrite($log, "$file\n");
            } catch (Exception $e) {
                // Handle the exception
                echo PHP_EOL . "Error uploading object: " . $e->getMessage() . PHP_EOL;
            }
        }
        $counter++;
        show_status($counter, sizeof($files));
    }
//    unlink("_log.files");
} catch (Exception $exception) {
    print_r($exception);
}

// status bar from https://snipplr.com/view/29548
function show_status($done, $total, $size=30) {

    static $start_time;

    // if we go over our bound, just ignore it
    if($done > $total) return;

    if(empty($start_time)) $start_time=time();
    $now = time();

    $perc=(double)($done/$total);

    $bar=floor($perc*$size);

    $status_bar="\r[";
    $status_bar.=str_repeat("=", $bar);
    if($bar<$size){
        $status_bar.=">";
        $status_bar.=str_repeat(" ", $size-$bar);
    } else {
        $status_bar.="=";
    }

    $disp=number_format($perc*100, 0);

    $status_bar.="] $disp%  $done/$total";

    $rate = ($now-$start_time)/$done;
    $left = $total - $done;
    $eta = round($rate * $left, 2);

    $elapsed = $now - $start_time;

    $status_bar.= " remaining: ".number_format($eta)." sec.  elapsed: ".number_format($elapsed)." sec.";

    echo "$status_bar  ";

    flush();

    // when done, send a newline
    if($done == $total) {
        echo "\n";
    }

}
