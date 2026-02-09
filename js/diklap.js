(async function(){

/* =========================
   HELPER FORMAT ANGKA
==========================*/

function formatNumberShort(num){

  num = Number(num) || 0;

  if(num >= 1000){
    return (num / 1000).toFixed(1).replace(".0","") + " K";
  }

  return num.toString();
}


/* =========================
   KPI DIKLAP
==========================*/

const sheetName = "KPI_DIKLAP";
const data = await getSheet(sheetName);

if(!data || data.length === 0){
  console.log("Sheet KPI_DIKLAP kosong");
  return;
}

data.forEach(r => {

  const kategori = (r.KATEGORI || "").toString().trim().toUpperCase();
  const program = Number(r.PROGRAM || 0);
  const realisasi = Number(r.REALISASI || 0);
  const persen = program > 0 
      ? ((realisasi / program) * 100).toFixed(0) + "%" 
      : "0%";


  /* ================= DIKLAP ================= */

  if(kategori === "DIKLAP"){

    if(document.getElementById("kpiProgramDiklap")){
      document.getElementById("kpiProgramDiklap").innerText =
        formatNumberShort(program);
    }

    if(document.getElementById("kpiRealisasiDiklap")){
      document.getElementById("kpiRealisasiDiklap").innerText =
        formatNumberShort(realisasi);
    }

    if(document.getElementById("kpiPersenDiklap")){
      document.getElementById("kpiPersenDiklap").innerText = persen;
    }
  }


  /* ================= PESERTA ================= */

  if(kategori === "PESERTA"){

    if(document.getElementById("kpiProgramPesertaDiklap")){
      document.getElementById("kpiProgramPesertaDiklap").innerText =
        formatNumberShort(program);
    }

    if(document.getElementById("kpiRealisasiPesertaDiklap")){
      document.getElementById("kpiRealisasiPesertaDiklap").innerText =
        formatNumberShort(realisasi);
    }

    if(document.getElementById("kpiPersenPesertaDiklap")){
      document.getElementById("kpiPersenPesertaDiklap").innerText = persen;
    }
  }

});

})();
(async function(){

const sheet = await getSheet("CHART_DIKLAP");

if(!sheet || sheet.length === 0){
    console.log("Sheet CHART_DIKLAP kosong");
    return;
}

const row = sheet[0];
const keys = Object.keys(row);

/*
Struktur sheet:

A  PELATIHAN VOL
B  MANDATORY
C  NON MANDATORY
D  (kosong)
E  PELATIHAN
F  MANDATORY
G  NON MANDATORY
*/

// ambil berdasarkan INDEX KOLOM ASLI
const volMandatory      = Number(row[keys[1]]) || 0; // kolom B
const volNonMandatory   = Number(row[keys[2]]) || 0; // kolom C
const pesertaMandatory  = Number(row[keys[5]]) || 0; // kolom F
const pesertaNonMandatory = Number(row[keys[6]]) || 0; // kolom G


/* =========================
   CHART VOL (3D)
========================= */

Highcharts.chart('mandatoryChart', {
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 15,
            depth: 70
        }
    },

    title: { text: null },

    xAxis: {
        categories: ['VOL']
    },

    yAxis: {
        min: 0,
        title: { text: null }
    },

    plotOptions: {
        column: {
            depth: 45,
            borderRadius: 6,
            dataLabels: {
                enabled: true
            }
        }
    },

    series: [
        {
            name: 'MANDATORY',
            color: '#1f7f84',
            data: [volMandatory]
        },
        {
            name: 'NON MANDATORY',
            color: '#d6dbc0',
            data: [volNonMandatory]
        }
    ],

    credits: { enabled:false }
});


/* =========================
   CHART PESERTA (3D)
========================= */

Highcharts.chart('pesertaDiklapChart', {
    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 15,
            depth: 70
        }
    },

    title: { text: null },

    xAxis: {
        categories: ['PESERTA']
    },

    yAxis: {
        min: 0,
        title: { text: null }
    },

    plotOptions: {
        column: {
            depth: 45,
            borderRadius: 6,
            dataLabels: {
                enabled: true,
                formatter: function(){
                    return this.y.toLocaleString('id-ID');
                }
            }
        }
    },

    series: [
        {
            name: 'MANDATORY',
            color: '#4c9aa5',
            data: [pesertaMandatory]
        },
        {
            name: 'NON MANDATORY',
            color: '#1f7f84',
            data: [pesertaNonMandatory]
        }
    ],

    credits: { enabled:false }
});

})();
/* =====================================================
   DETAIL DIKLAP (3D)
===================================================== */
let detailDiklapMaster = [];
let detailDiklapChart  = null;
/* =====================================================
   DETAIL DIKLAP (3D + CHECKBOX FILTER)
===================================================== */

(async function(){

const sheet = await getSheet("DETAIL_DIKLAP");

if(!sheet || sheet.length === 0){
    console.log("Sheet DETAIL_DIKLAP kosong");
    return;
}

/* =========================
   FORMAT DATA
========================= */

detailDiklapMaster = sheet.map(r => ({
    name: r.diklap,
    value: Number(r.total) || 0
}));

// sort terbesar → terkecil
detailDiklapMaster.sort((a,b)=> b.value - a.value);

renderDetailChart(detailDiklapMaster);
buildDetailCheckbox(detailDiklapMaster);

})();
function renderDetailChart(data){

if(!data || data.length === 0) return;

if(detailDiklapChart) detailDiklapChart.destroy();

detailDiklapChart = Highcharts.chart('detailDiklapChart', {

    chart: {
        type: 'column',
        backgroundColor: 'transparent',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 15,
            depth: 80
        }
    },

    title: { text: null },

    xAxis: {
        categories: data.map(d=>d.name),
        labels: {
            rotation: -45,
            style:{ fontSize:"11px" }
        }
    },

    yAxis: {
        min:0,
        title:{ text:null },
        labels:{
            formatter:function(){
                return this.value >= 1000
                    ? (this.value/1000)+"K"
                    : this.value;
            }
        }
    },

    plotOptions:{
        column:{
            depth:40,
            dataLabels:{
                enabled:true,
                formatter:function(){
                    return this.y.toLocaleString("id-ID");
                }
            }
        }
    },

    tooltip:{
        formatter:function(){
            return "<b>"+this.key+"</b><br/>"+
                   this.y.toLocaleString("id-ID");
        }
    },

    series:[{
        name:"Total",
        color:"#3e6dd1",
        data:data.map(d=>d.value)
    }],

    credits:{ enabled:false }

});

}
function buildDetailCheckbox(masterData){

const container = document.getElementById("checkboxContainerDiklap");
const search    = document.getElementById("searchDiklap");

if(!container || !search) return;

container.innerHTML = "";

/* ========= RENDER LIST ========= */

function renderList(filterText=""){

    container.innerHTML = "";

    masterData
    .filter(item =>
        item.name.toLowerCase().includes(filterText.toLowerCase())
    )
    .forEach(item=>{

        const label = document.createElement("label");

        label.innerHTML = `
            <input type="checkbox" value="${item.name}" checked>
            ${item.name}
        `;

        container.appendChild(label);
    });
}

renderList();

/* ========= SEARCH ========= */

search.addEventListener("input", function(){
    renderList(this.value);
});

/* ========= CHECKBOX CHANGE ========= */

document.getElementById("checkboxDiklap")
.addEventListener("change", function(){

    const checked = [
        ...container.querySelectorAll("input[type=checkbox]:checked")
    ].map(cb=>cb.value);

    const filtered = detailDiklapMaster.filter(d =>
        checked.includes(d.name)
    );

    renderDetailChart(filtered);
});

}
/* =========================
   DROPDOWN FILTER DIKLAP
========================= */

const selectBox = document.querySelector("#diklapFilter .select-box");
const checkboxList = document.getElementById("checkboxDiklap");

if(selectBox && checkboxList){

    selectBox.addEventListener("click", function(e){
        e.stopPropagation();
        checkboxList.style.display =
            checkboxList.style.display === "block"
                ? "none"
                : "block";
    });

    document.addEventListener("click", function(){
        checkboxList.style.display = "none";
    });

    checkboxList.addEventListener("click", function(e){
        e.stopPropagation();
    });
}
