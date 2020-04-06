const rulesBtn = $('#rules-btn');
const rules = $('#rules');
const closeBtn = $('#close-btn');
const ctx = canvas.getContext('2d');
const brickRows = 5;
const brickColumns = 9;

let score = 0;
//Create ball properties
const ball = {
	x     : canvas.width / 2,
	y     : canvas.height / 2,
	size  : 10,
	speed : 4,
	dx    : 4,
	dy    : -4
};

//Paddle properties
const paddle = {
	x     : canvas.width / 2 - 40,
	y     : canvas.height - 20,
	w     : 80,
	h     : 10,
	speed : 8,
	dx    : 0
};

//brick properties
const brick = {
	w       : 70,
	h       : 20,
	padding : 10,
	offsetX : 45,
	offsetY : 60,
	visible : true
};

//draw ball on canvas
function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
	ctx.fillStyle = '#0995dd';
	ctx.fill();
	ctx.closePath();
}

//draw paddle on canvas
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
	ctx.fillStyle = '#0995dd';
	ctx.fill();
	ctx.closePath();
}

//Create bricks
const bricks = [];
for (let i = 0; i < brickColumns; i++) {
	bricks[i] = [];
	for (let j = 0; j < brickRows; j++) {
		const x = i * (brick.w + brick.padding) + brick.offsetX;
		const y = j * (brick.h + brick.padding) + brick.offsetY;
		bricks[i][j] = { x, y, ...brick };
	}
}

//draw bricks
function drawBricks() {
	bricks.forEach((row) => {
		row.forEach((brick) => {
			ctx.beginPath();
			ctx.rect(brick.x, brick.y, brick.w, brick.h);
			ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
			ctx.fill();
			ctx.closePath();
		});
	});
}

//Draws score
function drawScore() {
	ctx.font = '20px Arial';
	ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//move the paddle on canvas
function movePaddle() {
	paddle.x += paddle.dx;

	//wall detection
	if (paddle.x + paddle.w > canvas.width) {
		paddle.x = canvas.width - paddle.w;
	} else if (paddle.x < 0) {
		paddle.x = 0;
	}
}

//move the ball on canvas
function moveBall() {
	ball.x += ball.dx;
	ball.y += ball.dy;

	//wall collision
	if (ball.y + ball.size >= canvas.height) reset();
	if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0)
		ball.dx *= -1;
	if (ball.y - ball.size < 0) ball.dy *= -1;

	if (
		ball.y + ball.size > paddle.y &&
		ball.x + ball.size < paddle.x + paddle.w &&
		ball.x - ball.size > paddle.x
	) {
		// ball.dy = -ball.speed;
		ball.dy *= -1;
	}

	//bricks collision
	bricks.forEach((row) => {
		row.forEach((brick) => {
			if (brick.visible) {
				if (
					ball.x - ball.size > brick.x &&
					ball.x + ball.size < brick.x + brick.w &&
					ball.y + ball.size > brick.y &&
					ball.y - ball.size < brick.y + brick.h
				) {
					ball.dy *= -1;
					brick.visible = false;
					score++;
				}
			}
		});
	});
}

//intiates paddle movement
function downKey(e) {
	if (e.key === 'Right' || e.key === 'ArrowRight') {
		paddle.dx = paddle.speed;
	} else if (e.key === 'Left' || e.key === 'ArrowLeft') {
		paddle.dx = -paddle.speed;
	}
}

//stops paddle movement
function upKey(e) {
	if (
		e.key === 'ArrowRight' ||
		e.key === 'Right' ||
		e.key === 'Left' ||
		e.key === 'ArrowLeft'
	)
		paddle.dx = 0;
}

//draw  everything
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawBall();
	drawPaddle();
	drawScore();
	drawBricks();
}

//continously update everything
function update() {
	movePaddle();
	moveBall();

	draw();

	requestAnimationFrame(update);
}

//reset everything
function reset() {
	score = 0;
	bricks.forEach((row) => {
		row.forEach((brick) => {
			brick.visible = true;
		});
	});
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.dx = 4;
	ball.dy = -4;
}

//EVENT LISTENERS

rulesBtn.click(() => rules[0].classList.add('show'));
closeBtn.click(() => rules[0].classList.remove('show'));

document.addEventListener('keydown', downKey);
document.addEventListener('keyup', upKey);

update();
