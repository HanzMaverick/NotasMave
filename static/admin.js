async function saveNote() {
    const name = document.getElementById('noteName').value;
    const password = document.getElementById('password').value;
    const content = document.getElementById('noteContent').value;

    const encryptedContent = CryptoJS.AES.encrypt(content, password).toString();

    const response = await fetch('/save-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content: encryptedContent })
    });

    const result = await response.json();
    document.getElementById('message').innerText = result.message || result.error;
  }

  async function fetchNote() {
    const form = document.getElementById('searchForm');
    form.classList.add('hidden'); // Ocultar el formulario

    const name = document.getElementById('searchNoteName').value;
    const password = document.getElementById('searchPassword').value;

    const response = await fetch(`/get-note/${name}`);
    const result = await response.json();
    if (result.error) {
      document.getElementById('noteResult').innerText = result.error;
      form.classList.remove('hidden'); // Mostrar el formulario si hay error
      return;
    }

    try {
      const decryptedContent = CryptoJS.AES.decrypt(result.content, password).toString(CryptoJS.enc.Utf8);
      if (!decryptedContent) {
        throw new Error("La contraseña es incorrecta o los datos están corruptos.");
      }
      document.getElementById('noteResult').innerText = `Contenido de la nota: ${decryptedContent}`;
    } catch (e) {
      document.getElementById('noteResult').innerText = e.message;
      form.classList.remove('hidden'); // Mostrar el formulario si hay error
    }

    document.getElementById('backButton').classList.remove('hidden'); // Mostrar el botón de regresar
  }

  function goBack() {
    const form = document.getElementById('searchForm');
    const result = document.getElementById('noteResult');
    const backButton = document.getElementById('backButton');

    // Limpia el contenido del resultado
    result.textContent = '';

    // Vuelve a mostrar el formulario
    form.classList.remove('hidden');

    // Oculta el botón de regresar
    backButton.classList.add('hidden');
  }

  async function editNote() {
    const name = document.getElementById('editName').value;
    const password = document.getElementById('editPassword').value;
    const newContent = document.getElementById('editContent').value;

    const encryptedContent = CryptoJS.AES.encrypt(newContent, password).toString();

    const response = await fetch('/edit-note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, content: encryptedContent, password })
    });

    const result = await response.json();
    document.getElementById('editMessage').innerText = result.message || result.error;
  }
