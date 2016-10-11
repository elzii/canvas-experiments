function drawCanvasBackground() {
  ctx.save();
  ctx.drawImage(document.getElementById("canvas-bg"), 0, 0);
  ctx.restore();
  ctx.restore();
}

function drawCanvasBgAsImage(ctx) {
  // Set background image
  var background = new Image();
  background.src = "http://i.imgur.com/kJEaKp6.jpg";

  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function(){
    ctx.drawImage(background,0,0);
  };
}