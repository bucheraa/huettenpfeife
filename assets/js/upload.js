const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewGrid = document.querySelector('.preview-grid');
const captionInput = document.getElementById('caption');
const uploadButton = document.getElementById('upload-button');
const feedback = document.querySelector('.upload-feedback');

const MAX_FILES = 10;

function remainingSlots() {
  return Math.max(0, MAX_FILES - previewGrid.querySelectorAll('.preview').length);
}

function updateUploadFeedback(message = '', isError = false) {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.classList.toggle('error', isError);
}

function createPreviewCard(file, caption) {
  const figure = document.createElement('figure');
  figure.className = 'preview';

  const img = document.createElement('img');
  img.alt = caption || file.name;

  const figcaption = document.createElement('figcaption');
  figcaption.textContent = caption || file.name;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'preview-remove';
  removeButton.setAttribute('aria-label', 'Foto entfernen');
  removeButton.innerHTML = '&times;';
  removeButton.addEventListener('click', () => {
    figure.remove();
    const slots = remainingSlots();
    updateUploadFeedback(
      slots > 0
        ? `Noch ${slots} Platz${slots === 1 ? '' : 'e'} frei.`
        : `Limit von ${MAX_FILES} Bildern erreicht.`,
      slots === 0
    );
  });

  const reader = new FileReader();
  reader.onload = event => {
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);

  figure.appendChild(img);
  figure.appendChild(figcaption);
  figure.appendChild(removeButton);
  previewGrid.prepend(figure);
}

function handleFiles(files) {
  const caption = captionInput.value.trim();
  const availableSlots = remainingSlots();

  if (availableSlots <= 0) {
    updateUploadFeedback(`Limit von ${MAX_FILES} Bildern erreicht. Entferne zuerst ein Bild.`, true);
    return;
  }

  let added = 0;
  let skipped = 0;

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      skipped += 1;
      continue;
    }
    if (added >= availableSlots) {
      skipped += 1;
      continue;
    }
    createPreviewCard(file, caption);
    added += 1;
  }

  captionInput.value = '';

  const slots = remainingSlots();
  if (added > 0) {
    updateUploadFeedback(
      slots > 0 ? `Noch ${slots} Platz${slots === 1 ? '' : 'e'} frei.` : `Limit von ${MAX_FILES} Bildern erreicht.`,
      slots === 0
    );
  } else if (skipped > 0) {
    updateUploadFeedback('Keine gültigen Bilddateien hinzugefügt oder Limit erreicht.', true);
  }
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

updateUploadFeedback(`Noch ${remainingSlots()} Plätze frei.`);
