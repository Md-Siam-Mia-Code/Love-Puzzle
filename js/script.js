var images = ['https://i.postimg.cc/g21tfsyc/Image.png'];

var currentIndex = 0;
var totalClicks = 0;

function randomizeImage() {
  let root = document.documentElement;
  root.style.setProperty('--image', 'url(' + images[currentIndex] + ')');
  currentIndex++;
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }
  var puzzleItems = document.querySelectorAll('#puzz i');
  for (var i = 0; i < puzzleItems.length; i++) {
    puzzleItems[i].style.left = Math.random() * (window.innerWidth - 100) + 'px';
    puzzleItems[i].style.top = Math.random() * (window.innerHeight - 100) + 'px';
  }
}

randomizeImage();

function reloadPuzzle() {
  var doneItems = document.querySelectorAll('.done');
  doneItems.forEach(function (element) {
    element.classList.toggle('done');
  });
  var droppedItems = document.querySelectorAll('.dropped');
  droppedItems.forEach(function (element) {
    element.classList.toggle('dropped');
  });
  var allDoneElement = document.querySelector('.allDone');
  allDoneElement.style = '';
  allDoneElement.classList.toggle('allDone');
}

// mobile functionality
var puzzleItemsMobile = document.querySelectorAll('#puzz i');
puzzleItemsMobile.forEach(function (element) {
  var startX, startY, offsetX, offsetY;
  var targetElement = document.querySelector('.' + element.className); // Assuming each piece has a corresponding target.

  element.addEventListener('mousedown', function () {
    totalClicks++;
    document.querySelector('#clicks').innerHTML = totalClicks;
  });

  element.addEventListener('click', function () {
    if (document.querySelector('.clicked')) {
      document.querySelector('.clicked').classList.toggle('clicked');
      element.classList.toggle('clicked');
    } else {
      element.classList.toggle('clicked');
    }
  });

  // For touch events: 
  element.addEventListener('touchstart', function (ev) {
    ev.preventDefault(); // Prevents scrolling but allows touch movement
    var touch = ev.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;

    // Store initial position of the puzzle piece
    offsetX = element.offsetLeft;
    offsetY = element.offsetTop;

    // Ensure the element is positioned properly and appears above other elements
    element.style.position = 'absolute'; // Set position to absolute for dragging
    element.classList.add('dragging');
    element.style.zIndex = '10'; // Ensure it's on top of other elements
  });

  element.addEventListener('touchmove', function (ev) {
    var touch = ev.touches[0];
    var deltaX = touch.clientX - startX;
    var deltaY = touch.clientY - startY;

    // Update the position of the puzzle piece during dragging
    element.style.left = offsetX + deltaX + 'px';
    element.style.top = offsetY + deltaY + 'px';
  });

  element.addEventListener('touchend', function (ev) {
    // Get target location for snapping
    var targetRect = targetElement.getBoundingClientRect();
    var pieceRect = element.getBoundingClientRect();

    // Define a tolerance range to snap the piece (e.g., within 50px)
    var tolerance = 50;

    if (
      Math.abs(pieceRect.left - targetRect.left) < tolerance &&
      Math.abs(pieceRect.top - targetRect.top) < tolerance
    ) {
      // Snap the piece into position
      element.style.left = targetRect.left + 'px';
      element.style.top = targetRect.top + 'px';
      element.classList.add('dropped');
      element.classList.add('done');
      element.classList.remove('dragging'); // Remove dragging class

      // Ensure the piece stays visible and in the correct position after dropping
      element.style.position = 'absolute';  // Keep it absolute for correct positioning
      element.style.zIndex = ''; // Reset z-index, as no longer dragging

      // Optionally check if all pieces are placed correctly
      if (document.querySelectorAll('.dropped').length == 9) {
        document.querySelector('#puzz').classList.add('allDone');
        document.querySelector('#puzz').style.border = 'none';
        document.querySelector('#puzz').style.animation = 'allDone 1s linear forwards';

        setTimeout(function () {
          reloadPuzzle();
          randomizeImage();
        }, 1500);
      }
    } else {
      // If not within tolerance, reset position
      element.style.left = offsetX + 'px';
      element.style.top = offsetY + 'px';
      element.classList.remove('dragging'); // Remove dragging class
    }
  });
});


var puzzleItemsDesktop = document.querySelectorAll('#puz i');
puzzleItemsDesktop.forEach(function (element) {
  element.addEventListener('click', function () {
    if (document.querySelector('.clicked')) {
      var clickedElement = document.querySelector('.clicked');
      if (clickedElement.classList.contains(element.classList)) {
        element.classList.add('dropped');
        clickedElement.classList.add('done');
        clickedElement.classList.toggle('clicked');

        if (document.querySelectorAll('.dropped').length == 9) {
          document.querySelector('#puz').classList.add('allDone');
          document.querySelector('#puz').style.border = 'none';
          document.querySelector('#puz').style.animation = 'allDone 1s linear forwards';

          setTimeout(function () {
            reloadPuzzle();
            randomizeImage();
          }, 1500);
        }
      }
    }
  });
});

// desktop drag and drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.className);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");

  if (ev.target.className == data) {
    ev.target.classList.add('dropped');
    document.querySelector('.' + data + "[draggable='true']").classList.add('done');

    if (document.querySelectorAll('.dropped').length == 9) {
      document.querySelector('#puz').classList.add('allDone');
      document.querySelector('#puz').style.border = 'none';
      document.querySelector('#puz').style.animation = 'allDone 1s linear forwards';

      const ILoveYou = document.querySelector('.ILoveYou');
      ILoveYou.style.display = 'flex';
      ILoveYou.style.animation = 'ILoveYou 1s linear forwards';

      setTimeout(function () {
        reloadPuzzle();
        randomizeImage();
      }, 1500);
    }
  }
}