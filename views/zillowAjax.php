<?php
$form = $_POST;

//$street = urlencode($form['street']);
//$city = urlencode($form['city']);
//$state = urlencode($form['state']);
$zip = urlencode($form['zip']);

$key = "X1-ZWz1frv9wboaa3_8nu8h"; //key to use service
$url = "http://www.zillow.com/webservice/GetDemographics.htm?zws-id=$key"; //Api Call url

//$query = $url."&zip=$zip";

if(isset($zip))
{
    $query = $url."&zip=$zip";
}
//else
//{
//    $query.="&citystatezip=$city+$state";
//}
echo $query; //echo the link info URL to see what we get back

$obj = simplexml_load_file($query);

$results = $obj->response;

$chart0 = $results->links->forSale; // gets forSale info
$chart = rtrim($chart0,"'/' "); //trims to get rid of the trailing '/'
//$value = $results->zestimate->amount;
//$overV = $results->links->graphsanddata;
//echo $overV;
//echo $value;

//$s = '';

$s ="<p> Click to see listing <a href= $chart> here </a> </p>"; 



echo (isset($results)?$s:"no data found");

?>