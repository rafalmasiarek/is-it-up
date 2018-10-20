$(document).ready(function() {
	console.log('ready');
	$("#targetAddress").focus();


	// HELPERS
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getRandomDouble(min, max) {
		return min + Math.random() * (max - min);
	}

	var isWorking = false;

	var onCheckStart = function() {
		if (isWorking) {
			return false;
		}

		ResultInicator.hide();

		Megaman.start();

		isWorking = true;

		$("#targetAddress")
			.attr("readonly", "readonly")
			.addClass("loading");
		$("#barAnimationCanvas").show();

		return true;
	};

	var onCheckEnd = function(response) {
		isWorking = false;

		$("#targetAddress")
			.removeAttr("readonly")
			.removeClass("loading");
		
		$("#barAnimationCanvas").hide();

		if (response.status === true) {
			Megaman.runToFinish();
			ResultInicator.alive();
			
		} else {
			Megaman.kill();
			ResultInicator.dead();
			
		}

	};






	var requestSuccess = function(data) {
		onCheckEnd($.parseJSON(data));
	};

	var requestError = function(data) {
		// onCheckEnd({message: "connection error"});
	};

	var sendRequest = function(url) {

		$.ajax({
			type: "POST",
			url: "backend.php",
			data: {
				url: url
			},
			success: requestSuccess,
			error: requestError
		});

	};

	var checkAddress = function(addressToCheck) {
		if (!onCheckStart()) {
			return;
		}

		sendRequest(addressToCheck);
	};

	$("#form").submit(function(event) {
		event.preventDefault();

		var targetAddess = $("#targetAddress").val();
		console.log("checking: "+targetAddess);

		$(".domainName").text(targetAddess);
		checkAddress(targetAddess);
		setTimeout( function() {
			$("#myModal").modal('show')
		},5000);
	});

	var Megaman = {
		start: function() {
			$("#megaman").removeClass("dead").removeClass("alive");
			$("#megaman").show();

		},
		runToFinish: function() {
			$("#megaman").hide();
		},
		kill: function() {
			$("#megaman").hide();
		}
	};



	var ResultInicator = {
		hide: function() {
			$("#resultDead").hide();
			$("#resultAlive").hide();

		},
		alive: function() {
			$("#resultAlive").show();

		},
		dead: function() {
			$("#resultDead").show();

		}
	};






	//CANVAS

	var ctx, canvas;
	var lines;
	var width, height;


	var LineObject = function(pos, rad, color) {
		var self = this;

		(function() {
			self.pos = pos || null;
			self.radius = rad || null;
			self.color = color || null;
			// self.distance = 0;
		})();

		this.draw = function() {
			if ( self.distance > 40000 ) return;
			ctx.beginPath();
			ctx.moveTo(self.pos.x, self.pos.y);
			ctx.lineTo((self.pos.x + self.pos.length), self.pos.y);
			ctx.stroke();
			// ctx.arc( self.pos.x, self.pos.y, 2, 0, 2 * Math.PI, false );
			ctx.strokeStyle = color;
			ctx.fill();
		};
	};


	var initShapes = function() {
		var canvas = $('#barAnimationCanvas')[0];

		width = $('#barAnimationCanvas').width();
		height = $('#barAnimationCanvas').height();

		canvas.width = width;
		canvas.height = height;
		ctx = canvas.getContext('2d');

		lines = [];


	};

	var addLine = function() {
		var x = 0;
		var y = getRandomInt(0, height);

		var p = {
			x: width, //start at end (right)
			y: y,
			length: getRandomInt(10, 100)
		};

		lines.push(p);

		var c = new LineObject( p, 5, 'rgba(0,0,255,0.3)' );
		p.graph = c;

		moveLine( p );
	};





	var moveLine = function(p) {
		var time = getRandomDouble(0.8, 1.2);
		TweenLite.to(p, time, {
			x: - (p.length),
			onComplete: function() {
				//REMOVE THE OBJECT
			},
			ease: Linear.easeNone
		});
	};

	var initAnimation = function() {
		animate();
		// for (var i in lines) {
		// 	moveLines( lines[i] );
		// }
	};


	var animate = function(ts) {
		ctx.clearRect( 0, 0, width, height );


		for (var i in lines) {

			if (!lines[i].invisible)
				lines[i].graph.draw();
		}



		window.requestAnimationFrame(animate);
	};



	$(document).ready(function() {
		initShapes();
		initAnimation();

		setInterval(function() {
			addLine();
		}, 20);
	});



});