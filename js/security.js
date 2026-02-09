/* =====================================================
   GLOBAL VARIABLE
===================================================== */

let dataAtas = [];
let dataBawah = [];


/* =====================================================
   HELPER AMBIL VALUE AMAN (HANDLE HEADER VARIASI)
===================================================== */

function getValue(row, key1, key2 = null) {
    return row[key1] ?? row[key2] ?? "";
}


/* =====================================================
   GENERATE CHECKBOX
===================================================== */

function generateCheckbox(data, containerId, filterFunction){

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const uniqueTema = [...new Set(data.map(d => d.TEMA))];

    uniqueTema.forEach(tema => {

        const label = document.createElement("label");

        label.innerHTML = `
            <input type="checkbox" value="${tema}" checked>
            ${tema}
        `;

        container.appendChild(label);

        label.querySelector("input")
            .addEventListener("change", filterFunction);
    });
}


/* =====================================================
   SEARCH FILTER
===================================================== */

function enableSearch(searchId, containerId){

    const search = document.getElementById(searchId);
    if (!search) return;

    search.addEventListener("keyup", function(){

        const value = this.value.toLowerCase();
        const labels = document
            .getElementById(containerId)
            .getElementsByTagName("label");

        for(let i=0;i<labels.length;i++){
            const text = labels[i].innerText.toLowerCase();
            labels[i].style.display =
                text.includes(value) ? "" : "none";
        }
    });
}


/* =====================================================
   RENDER TABLE ATAS
===================================================== */

function renderTableAtas(data){

    const tbody = document.getElementById("tableAtasBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach((row, index) => {

        const tema = getValue(row, "TEMA");
        const volume = getValue(row, "PROGRAM KERJA", "PROGRAM_KERJA");

        tbody.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${tema}</td>
                <td style="text-align:center;font-weight:600;">
                    ${volume}
                </td>
            </tr>
        `;
    });
}


/* =====================================================
   RENDER TABLE BAWAH
===================================================== */

function renderTableBawah(data){

    const tbody = document.getElementById("tableBawahBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach((row, index) => {

        const tema = getValue(row, "TEMA");
        const program = getValue(row, "PROGRAM KERJA", "PROGRAM_KERJA");
        const realisasi = getValue(row, "REALISASI");
        const tujuan = getValue(row, "TUJUAN");
        const tanggal = getValue(row, "TANGGAL");
        const status = getValue(row, "STATUS");
        const link = getValue(row, "LINK");

        tbody.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${tema}</td>
                <td>${program}</td>
                <td>${realisasi}</td>
                <td>${tujuan}</td>
                <td>${tanggal}</td>
                <td>${status}</td>
                <td>
                    ${link ? `<a href="${link}" target="_blank">Open</a>` : ""}
                </td>
            </tr>
        `;
    });
}


/* =====================================================
   FILTER ATAS
===================================================== */

function filterAtas(){

    const checked = [...document.querySelectorAll("#checkboxContainerAtas input:checked")]
        .map(cb => cb.value);

    const filtered = dataAtas.filter(d => checked.includes(d.TEMA));

    renderTableAtas(filtered);
}


/* =====================================================
   FILTER BAWAH
===================================================== */

function filterBawah(){

    const checked = [...document.querySelectorAll("#checkboxContainerBawah input:checked")]
        .map(cb => cb.value);

    const filtered = dataBawah.filter(d => checked.includes(d.TEMA));

    renderTableBawah(filtered);
}


/* =====================================================
   LOAD DATA SAAT PAGE READY
===================================================== */

document.addEventListener("DOMContentLoaded", async function(){

    try {

        // ==============================
        // SHEET ATAS
        // ==============================
        dataAtas = await getSheet("Volume_Program_Realisasi_Kerja");

        renderTableAtas(dataAtas);
        generateCheckbox(dataAtas, "checkboxContainerAtas", filterAtas);
        enableSearch("searchTemaAtas", "checkboxContainerAtas");


        // ==============================
        // SHEET BAWAH
        // ==============================
        dataBawah = await getSheet("Detail_Program_dan_Realisasi_Kerja_LC");

        renderTableBawah(dataBawah);
        generateCheckbox(dataBawah, "checkboxContainerBawah", filterBawah);
        enableSearch("searchTemaBawah", "checkboxContainerBawah");

    } catch (error) {
        console.error("Gagal ambil data:", error);
    }

});
// DROPDOWN ATAS
document.querySelector('#filterAtas .select-box')
.addEventListener('click', function(){
    const list = document.getElementById('checkboxListAtas');
    list.style.display =
        list.style.display === 'block' ? 'none' : 'block';
});

// DROPDOWN BAWAH
document.querySelector('#filterBawah .select-box')
.addEventListener('click', function(){
    const list = document.getElementById('checkboxListBawah');
    list.style.display =
        list.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener("DOMContentLoaded", async function(){

    try {

        console.log("Mulai ambil data...");

        const test = await getSheet("Volume_Program_Realisasi_Kerja");

        console.log("DATA ATAS:", test);

    } catch (err) {
        console.error("ERROR:", err);
    }

});
function renderTableAtas(data){

    const tbody = document.getElementById("tableAtasBody");
    const info = document.getElementById("infoAtas");

    tbody.innerHTML = "";

    data.forEach((row, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${row.TEMA || ""}</td>
                <td>${row["PROGRAM KERJA"] || ""}</td>
            </tr>
        `;
    });

    info.innerText = `Total Data: ${data.length}`;
}
function renderTableBawah(data){

    const tbody = document.getElementById("tableBawahBody");
    const info = document.getElementById("infoBawah");

    tbody.innerHTML = "";

    data.forEach((row, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index+1}</td>
                <td>${row.TEMA || ""}</td>
                <td>${row["PROGRAM KERJA"] || ""}</td>
                <td>${row.REALISASI || ""}</td>
                <td>${row.TUJUAN || ""}</td>
                <td>${row.TANGGAL || ""}</td>
                <td>${row.STATUS || ""}</td>
                <td>${row.LINK ? `<a href="${row.LINK}" target="_blank">Open</a>` : ""}</td>
            </tr>
        `;
    });

    info.innerText = `Total Data: ${data.length}`;
}
