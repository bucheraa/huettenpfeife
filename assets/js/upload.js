const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewGrid = document.querySelector('.preview-grid');
const captionInput = document.getElementById('caption');
const uploadButton = document.getElementById('upload-button');

function createPreviewCard(file, caption) {
  const figure = document.createElement('figure');
  figure.className = 'preview';

  const img = document.createElement('img');
  img.alt = caption || file.name;

  const figcaption = document.createElement('figcaption');
  figcaption.textContent = caption || file.name;

  const reader = new FileReader();
  reader.onload = event => {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);

  figure.appendChild(img);
  figure.appendChild(figcaption);
  previewGrid.prepend(figure);
}

function handleFiles(files) {
  const caption = captionInput.value.trim();
  [...files].forEach(file => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    createPreviewCard(file, caption);
  });
  captionInput.value = '';
}

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', event => {
  event.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', event => {
  event.preventDefault();
  uploadArea.classList.remove('dragover');
  handleFiles(event.dataTransfer.files);
});

fileInput.addEventListener('change', event => {
  handleFiles(event.target.files);
  fileInput.value = '';
});

uploadButton.addEventListener('click', () => {
  fileInput.click();
});
