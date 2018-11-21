
var setting;

window.onload = function(){

	setting = [
		{
			form: document.getElementById('form'),
			button: document.getElementById('button'),
			message: document.getElementById('message'),
			folder: 'answer',
			sending: false,
		},
	]

	for(var i = 0; i < setting.length; ++i) {
		if( setting[i]['button'] ) {
			setting[i]['button'].onclick = (function(_i){return function(){ checkAns(_i); };})(i);
		}
		if( setting[i]['form'] ) {
			setting[i]['form'].onkeydown = (function(_i){ return function(event){
				if (event == undefined) event = window.event;
				if (event.keyCode == 13) checkAns(_i);
			}})(i);
		}
	}

}

function checkAns(id){

	if(setting[id]['sending']) return;
	setting[id]['sending'] = true;
	setting[id]['button'].disabled = true;
	setting[id]['message'].innerText = "チェック中...";

	var request = new XMLHttpRequest();
	request.timeout = 10000;
	request.open('GET', setting[id]['folder'] + '/' + encodeURIComponent(setting[id]['form'].value));
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	request.send(null);

	request.onreadystatechange = function(){
		if(request.readyState == 4){
			if( setting[id]['form'].value == '' ){
				setting[id]['message'].innerText = "不正解です。";
			} else {
				switch(request.status){
					case 200:
						location.href = request.responseText;
						break;
					case 404:
						setting[id]['message'].innerText = "不正解です。";
						break;
					default:
						setting[id]['message'].innerText = "通信障害が発生しています。もう一度やりなおしてください。";
						break;
				}
			}
			setting[id]['button'].disabled = false;
			setting[id]['sending'] = false;
		}
	}

	request.ontimeout = function(){
		setting[id]['message'].innerText = "タイムアウトしました。もう一度やりなおしてください。";
		setting[id]['button'].disabled = false;
		setting[id]['sending'] = false;
	}

}
