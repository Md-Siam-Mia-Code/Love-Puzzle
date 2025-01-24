var images = ['assets/img/image.png']; // Array of images
var currentIndex = 0;
var totalClicks = 0;

// Function to randomize image and reposition puzzle pieces
function randomizeImage() {
  let root = document.documentElement;
  root.style.setProperty('--image', 'url(' + images[currentIndex] + ')');
  currentIndex++;
  if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  var puzzleItems = document.querySelectorAll('#puzz i');
  puzzleItems.forEach(item => {
    item.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    item.style.top = Math.random() * (window.innerHeight - 100) + 'px';
  });
}

// Function to reload the puzzle
function reloadPuzzle() {
  document.querySelectorAll('.done').forEach(element => {
    element.classList.remove('done');
  });

  document.querySelectorAll('.dropped').forEach(element => {
    element.classList.remove('dropped');
  });

  var allDoneElement = document.querySelector('#puz');
  if (allDoneElement.classList.contains('allDone')) {
    allDoneElement.classList.remove('allDone');
    allDoneElement.style = '';
  }
}

// Initialize the puzzle
randomizeImage();

// Mobile-specific functionality
document.querySelectorAll('#puzz i').forEach(element => {
  element.addEventListener('mousedown', () => {
    totalClicks++;
    document.querySelector('#clicks').innerHTML = totalClicks;
  });

  element.addEventListener('click', () => {
    const clickedElement = document.querySelector('.clicked');
    if (clickedElement) {
      clickedElement.classList.remove('clicked');
    }
    element.classList.add('clicked');
  });
});

// Desktop-specific functionality
document.querySelectorAll('#puz i').forEach(element => {
  element.addEventListener('click', () => {
    const clickedElement = document.querySelector('.clicked');
    if (clickedElement && clickedElement.classList.contains(element.classList[0])) {
      element.classList.add('dropped');
      clickedElement.classList.add('done');
      clickedElement.classList.remove('clicked');

      if (document.querySelectorAll('.dropped').length === 9) {
        const puzzleContainer = document.querySelector('#puz');
        puzzleContainer.classList.add('allDone');
        puzzleContainer.style.border = 'none';
        puzzleContainer.style.animation = 'allDone 1s linear forwards';

        setTimeout(() => {
          reloadPuzzle();
          randomizeImage();
        }, 1500);
      }
    }
  });
});

// Drag-and-drop functionality for desktop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.className);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData('text');
  if (ev.target.className === data) {
    ev.target.classList.add('dropped');
    document.querySelector('.' + data + "[draggable='true']").classList.add('done');

    if (document.querySelectorAll('.dropped').length === 9) {
      const puzzleContainer = document.querySelector('#puz');
      puzzleContainer.classList.add('allDone');
      puzzleContainer.style.border = 'none';
      puzzleContainer.style.animation = 'allDone 1s linear forwards';

      const ILoveYou = document.querySelector('.ILoveYou');
      ILoveYou.style.display = 'flex';
      ILoveYou.style.animation = 'ILoveYou 1s linear forwards';

      setTimeout(() => {
        reloadPuzzle();
        randomizeImage();
      }, 1500);
    }
  }
}