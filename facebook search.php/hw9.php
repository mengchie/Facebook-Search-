
 <?php 
 	//echo 'hahahahahha';

 	require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
	$fb = new Facebook\Facebook([
  		'app_id' => '1433758233336021',
  		'app_secret' => '3ace06ef8d57d49c602a8c0e5efa7907',
  		'default_graph_version' => 'v2.8',
	]);	
	$fb->setDefaultAccessToken('EAAUXZCtoxGNUBAKJ8PZCZA0YeeywmZBCq4ZAj2DmZCwZC5ZBzpIzkmuiS3YFIQB6uS6VxW54dGBIuvZC4ghQ6sTaIKxnH09I0d0EOp8jeZAZCZCCJNwTYGVFcIPykfTOsWFkH7ke6tBAZAdFJS9DYVz05Pe3Afh92HIEkeogZD');
	date_default_timezone_set('America/Los_Angeles');
	$fb_Token = 'EAAUXZCtoxGNUBAKJ8PZCZA0YeeywmZBCq4ZAj2DmZCwZC5ZBzpIzkmuiS3YFIQB6uS6VxW54dGBIuvZC4ghQ6sTaIKxnH09I0d0EOp8jeZAZCZCCJNwTYGVFcIPykfTOsWFkH7ke6tBAZAdFJS9DYVz05Pe3Afh92HIEkeogZD';
	// echo (null + ',' + null)==',';


 	if(isset($_GET["search"])){
		$key = $_GET["search"];
		$mode= $_GET["mode"];
		$offset= $_GET["offset"];
		if(isset($_GET["center"]) && ($_GET["center"]) != 'null' && $_GET['center']!=null && $mode=='place'){
			//echo 'has center';
			$center = $_GET["center"];
			$response = $fb->get("/search?q=$key&type=$mode&limit=25&offset=$offset&center=$center&fields=id,name,picture.width(700).height(700)");
		}else{
			//echo 'no center';
			$response = $fb->get("/search?q=$key&type=$mode&limit=25&offset=$offset&fields=id,name,picture.width(700).height(700)");

		}
		
		// $arr = json_decode($response->getGraphEdge(), true);
		$a = $response->getBody();
		echo $a;
	}
	if(isset($_GET["detail"])){
		$id = $_GET["detail"];
		if(isset($_GET["tag"]) && $_GET["tag"] == 'event'){
			$response = $fb->get("/".$id."?fields=id,name,picture.width(700).height(700)");
			$a = $response->getGraphNode();
		}else{
			$response = $fb->get("/".$id."?fields=id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name,picture.width(700).height(700)}},posts.limit(5)");

			$d_arr = json_decode($response->getGraphNode(), true);
			if(isset($d_arr['albums'])){
				foreach ($d_arr['albums'] as &$alb_arr) {
					if(isset($alb_arr['photos'])){
						foreach ($alb_arr['photos'] as &$photo) {
							$pic_id = $photo['id'];
							$url = $fb->get("$pic_id/picture?redirect=false");
							$newUrl = $url->getGraphNode()->asArray();

							// echo (json_encode($newUrl));
							$photo['picture'] = $newUrl['url'];
						}
					}
				}
			}
			// $arr = json_decode($response->getGraphEdge(), true);
			$a = json_encode($d_arr);
		}
		
		
		
		// $a = $response->getBody();
		echo $a;

	}
		//改完之後, encode
?>