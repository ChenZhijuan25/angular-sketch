var sketch=angular.module('sketch',[]);
sketch.controller('sketchcontroller', ['$scope', function($scope){
	$scope.controlless={width:600,height:600};
	$scope.csState = {
		fillstyle:'#000000',
		strokeStyle:'#000000',
		lineWidth:1,
		style:'stroke'
	}
	$scope.setStyle = function (s){
		$scope.csState.style = s;
	}
	$scope.newSketch = function(){
		if(current){
			if( confirm('是否保存') ){
				location.href = canvas.toDataURL();		
			}
		}
		clearCanvas();
		current = null;
	}
	$scope.save = function(ev){
		if(current){
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download = 'mypic.png';
		}else{
			alert('空画布');
		}
	}
	var canvas=document.querySelector('#canvas1');
	var ctx=canvas.getContext('2d');
	var current;//保存之前的
	$scope.tool='line';
	$scope.tools={
		'./images/zhixian.png':'line',
		'./images/yuan.png':'arc',
		'./images/juxing.png':'rect',
		'./images/gengbi.png':'pen',
		'./images/xingpi.png':'erase',
		
	}
	$scope.settool=function(s){
		$scope.tool=s;
	}
	var clearcanvas=function(){
		ctx.clearRect(0,0,$scope.controlless.width,$scope.controlless.height);
	}
	var setmousemove={
		line:function(e){
	         canvas.onmousemove=function(ev){
				clearcanvas();
				if(current){
					ctx.putImageData(current,0,0);
				}
			
			    ctx.beginPath();
	            ctx.moveTo(e.offsetX,e.offsetY);
	            ctx.lineTo(ev.offsetX,ev.offsetY);
	            ctx.stroke();
			}
		},
        arc:function(e){
	         canvas.onmousemove=function(ev){
				clearcanvas();
				if(current){
					ctx.putImageData(current,0,0);//把之前的图像读出来
				}
	        	ctx.beginPath();
	            var r=Math.abs(ev.offsetX-e.offsetX);
	            ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
	            if($scope.csState.style=='fill'){
                   ctx.fill();
	            }else{
	               ctx.stroke();
	            }
	            
			}
	    },
		rect:function(e){
	         canvas.onmousemove=function(ev){
				clearcanvas();
				if(current){
					ctx.putImageData(current,0,0);
				}
				ctx.beginPath();
	            var w=ev.offsetX-e.offsetX;
	            var h=ev.offsetY-e.offsetY;
	            ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				if($scope.csState.style=='fill'){
					ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,ev.offsetX-e.offsetX,ev.offsetY-e.offsetY);	
				}else{
					ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,ev.offsetX-e.offsetX,ev.offsetY-e.offsetY);	
				}
			}
		},
		pen:function(e){
			 ctx.beginPath(); 
			 ctx.moveTo(e.offsetX,e.offsetY);
	         canvas.onmousemove=function(ev){
				clearcanvas();
				if(current){
					ctx.putImageData(current,0,0);
				}
	            ctx.lineTo(ev.offsetX,ev.offsetY);
	            ctx.stroke();
			}
		},
		erase:function(e){
			canvas.onmousemove=function(ev){
				ctx.clearRect(ev.offsetX,ev.offsetY,20,20);
			}
		}
	}
	
	canvas.onmousedown=function(e){
		ctx.fillStyle = $scope.csState.fillStyle;
		ctx.strokeStyle = $scope.csState.strokeStyle;
		ctx.lineWidth  = $scope.csState.lineWidth;
        setmousemove[$scope.tool](e);
		document.onmouseup=function(){
           canvas.onmousemove=null;
           canvas.onmouseup=null;
           current=ctx.getImageData(0,0,$scope.controlless.width,$scope.controlless.height);
		}
	}
}])