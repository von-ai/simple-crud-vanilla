# Simple Student Data CRUD Web App

This project is a simple web application for managing student data using HTML, CSS, and JavaScript. Its main features include adding, editing, deleting, searching, sorting, uploading data from Excel/CSV, and exporting to PDF. The project was developed as an assignment for the Web Programming course and uses Indonesian as the interface language.

## Note

- **Nama = Name**
- **NIM (Nomor Induk Mahasiswa) = Student ID**
- **IPK (Indeks Prestasi Kumulatif) = GPA (Grade Point Average)**

## Features

- **Add/Edit/Delete Student Data**
- **Search by Nama/NIM/IPK**
- **Table Column Sorting**
- **Upload Data from Excel/CSV File**
- **Download Data as PDF**
- **Data Storage in Local Storage**

## How to Use

1. **Clone or download this repository.**
2. Open `index.html` in your browser.
3. Add student data using the form.
4. Search for students using the search bar.
5. Upload data from Excel/CSV file (format: Nama | NIM | IPK).
6. Download data as PDF using the provided button.

## File Structure

- `index.html` — Main application page.
- `style.css` — Application styles.
- `script.js` — Application logic (CRUD, upload, download, search, sort).
- `README.md` — Project documentation.

## Libraries Used

- [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) — For reading Excel/CSV files.
- [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) — For exporting data to PDF.

## Upload File Format

Excel/CSV file must have columns:
- Nama
- NIM
- IPK

The first row is considered as the header.

## License

This project is free to use for learning and further development.
