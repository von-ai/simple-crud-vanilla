const STORAGE_KEY = 'crud_mahasiswa';

if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'login.html'; // kalau belum login, lempar balik
}

const loadData = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const saveData = (list) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

let data = loadData();
let autoId = data.reduce((m, o) => Math.max(m, o.id), 0) + 1;

const form = document.getElementById('form-mahasiswa');
const elId = document.getElementById('id');
const elNama = document.getElementById('nama');
const elNim = document.getElementById('nim');
const elIpk = document.getElementById('ipk');
const tbody = document.getElementById('tbody');
const btnReset = document.getElementById('btn-reset');
const ths = document.querySelectorAll('thead th[data-col]');

let sortConfig = { key: null, direction: 1 };

function render() {
  if (!Array.isArray(data)) data = [];
  tbody.innerHTML = '';
  data.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${row.nama}</td>
            <td>${row.nim}</td>
            <td>${!isNaN(row.ipk) ? row.ipk.toFixed(2) : '-'}</td>
            <td>
              <button type="button" data-edit="${row.id}">Edit</button>
              <button type="button" data-del="${row.id}">Hapus</button>
            </td>
          `;
    tbody.appendChild(tr);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const idVal = elId.value.trim();
  const nama = elNama.value.trim();
  const nim = elNim.value.trim();
  const ipk = parseFloat(elIpk.value);

  if (!nama || !nim || isNaN(ipk)) {
    return alert('Nama, NIM, dan IPK wajib diisi.');
  }

  if (idVal) {
    const idNum = Number(idVal);
    const idx = data.findIndex((x) => x.id === idNum);
    if (idx >= 0) {
      data[idx].nama = nama;
      data[idx].nim = nim;
      data[idx].ipk = ipk;
    }
  } else {
    data.push({ id: autoId++, nama, nim, ipk });
  }

  saveData(data);
  render();
  form.reset();
  elId.value = '';
  elNama.focus();
});

btnReset.addEventListener('click', () => {
  form.reset();
  elId.value = '';
  elNama.focus();
});

tbody.addEventListener('click', (e) => {
  const editId = e.target.getAttribute('data-edit');
  const delId = e.target.getAttribute('data-del');

  if (editId) {
    const item = data.find((x) => x.id === Number(editId));
    if (item) {
      elId.value = item.id;
      elNama.value = item.nama;
      elNim.value = item.nim;
      elIpk.value = item.ipk;
      elNama.focus();
    }
  }

  //TODO search for confirm form toast
  if (delId) {
    const idNum = Number(delId);
    if (confirm('Yakin hapus data ini?')) {
      data = data.filter((x) => x.id !== idNum);
      saveData(data);
      render();
    }
  }
});

// Sorting
ths.forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.col;
    if (sortConfig.key === key) {
      sortConfig.direction *= -1;
    } else {
      sortConfig.key = key;
      sortConfig.direction = 1;
    }

    // clear class
    ths.forEach((t) => t.classList.remove('asc', 'desc'));
    th.classList.add(sortConfig.direction === 1 ? 'asc' : 'desc');

    data.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return -1 * sortConfig.direction;
      if (valA > valB) return 1 * sortConfig.direction;
      return 0;
    });

    render();
  });
});

render();

// Fitur Search
function searchBar() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();
  const rows = tbody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const rowText = rows[i].innerText.toLowerCase();
    if (rowText.indexOf(filter) >= 0) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
}
document.getElementById('searchInput').addEventListener('keyup', searchBar);

// Upload logic
document.getElementById('btnUpload').addEventListener('click', () => {
  const fileInput = document.getElementById('fileUpload');
  const file = fileInput.files[0];
  if (!file) {
    //Penggunaan with element
    Toastify({
      text: 'Pilih File Terlebih Dahulu!',
      duration: 3000,
      destination: 'https://github.com/apvarun/toastify-js',
      newWindow: true,
      close: true,
      gravity: 'top',
      position: 'center',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #4338ca, #fffff)',
      },
      onClick: function () {},
    }).showToast();
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const dataFile = new Uint8Array(event.target.result);
    const workBook = XLSX.read(dataFile, { type: 'array' });

    const sheetName = workBook.SheetNames[0];
    const sheet = workBook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Kolom = Nama | NIM | IPK
    rows.slice(1).forEach((r) => {
      if (r[0] && r[1] && r[2]) {
        data.push({
          id: autoId++,
          nama: String(r[0]),
          nim: String(r[1]),
          ipk: parseFloat(r[2]) || 0,
        });
      }
    });

    saveData(data);
    render();
    fileInput.value = '';
    Toastify({
      text: 'File Berhasil diupload',
      duration: 3000,
      destination: 'https://github.com/apvarun/toastify-js',
      newWindow: true,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'center', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'linear-gradient(to right, #4338ca, #fffff)',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  };

  reader.readAsArrayBuffer(file);
});

// Logic Fitur Download
document.getElementById('btnDownload').addEventListener('click', () => {
  //import jspdf
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text('Daftar Mahasiswa', 14, 15);

  const tableData = data.map((mhs, idx) => [
    idx + 1,
    mhs.nama,
    mhs.nim,
    mhs.ipk.toFixed(2),
  ]);

  doc.autoTable({
    head: [['#', 'Nama', 'NIM', 'IPK']],
    body: tableData,
    startY: 20,
  });

  doc.save('data_mahasiswa.pdf');
});

// Logic login.html
function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');

  const validUser = 'admin';
  const validPass = '12345';

  if (user === validUser && pass === validPass) {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'index.html';
  } else {
    errorMsg.textContent = 'username atau password salah';
  }
}
