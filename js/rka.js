
document.addEventListener("DOMContentLoaded", function(){

renderDonut();
renderBiaya();
renderTbOut();
renderPendidikan();
renderFasum();
generatePrognosaCheckbox();
renderPrognosaChart(prognosaData);

});

/* ================= DONUT ================= */

function renderDonut(){

Highcharts.chart('rkaDonut', {
    chart: { type: 'pie' },
    title: { text: null },
    plotOptions: {
        pie: {
            innerSize: '60%',
            dataLabels: { enabled: true }
        }
    },
    series: [{
        data: [
            { name:'TB MT', y:81.3 },
            { name:'RKA MTTO', y:14.1 },
            { name:'TB NON MT', y:4.7 }
        ]
    }],
    credits:{enabled:false}
});

Highcharts.chart('consumedDonut', {
    chart: { type: 'pie' },
    title: { text: null },
    plotOptions: {
        pie: { innerSize:'60%', dataLabels:{enabled:true}}
    },
    series: [{
        data: [
            { name:'TB OUT', y:72.1 },
            { name:'PELATIHAN', y:23.8 },
            { name:'UMUM', y:4.1 }
        ]
    }],
    credits:{enabled:false}
});

}

/* ================= BIAYA ================= */

function renderBiaya(){
Highcharts.chart('biayaChart',{
    chart:{type:'column'},
    title:{text:null},
    xAxis:{categories:['2021','2022','2023','2024','2025']},
    series:[{
        name:'Biaya Pelatihan',
        data:[2.2,5.3,3.0,4.5,6.8],
        color:'#1f7e8a'
    }],
    credits:{enabled:false}
});
}

/* ================= DATA ================= */

const tbData = [
    { name:'Grand Total', value:24 },
    { name:'Perjalanan', value:22 },
    { name:'ATK', value:1 },
    { name:'Listrik', value:0.5 }
];

const pendidikanData = [
    { name:'Pelatihan A', value:600 },
    { name:'Pelatihan B', value:500 },
    { name:'Pelatihan C', value:120 }
];

const fasumData = [
    { name:'Grand Total', value:1200 },
    { name:'Inventaris', value:500 },
    { name:'ATK', value:50 }
];

const prognosaData = [
    { name:'Program', value:20 },
    { name:'Prognosa', value:12 },
    { name:'Consumed', value:8 },
    { name:'Sisa Akhir Tahun', value:6 }
];


/* ================= GENERATE CHECKBOX ================= */

function generateCheckbox(data, containerId, chartFunction){
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    data.forEach(item=>{
        const label = document.createElement("label");
        label.innerHTML = `
            <input type="checkbox" value="${item.name}" checked>
            ${item.name}
        `;
        container.appendChild(label);

        label.querySelector("input")
        .addEventListener("change", ()=>{
            const checked = [...container.querySelectorAll("input:checked")]
                .map(cb=>cb.value);

            const filtered = data.filter(d=>checked.includes(d.name));
            chartFunction(filtered);
        });
    });
}

/* ================= RENDER CHART ================= */

function renderBarChart(container, data, color){
    Highcharts.chart(container,{
        chart:{ type:'bar' },
        title:{ text:null },
        xAxis:{ categories:data.map(d=>d.name) },
        series:[{
            name:'Nilai',
            data:data.map(d=>d.value),
            color:color
        }],
        credits:{enabled:false}
    });
}


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", function(){

    renderBarChart('tbOutChart', tbData, '#2e7d32');
    renderBarChart('pendidikanChart', pendidikanData, '#f2994a');
    renderBarChart('fasumChart', fasumData, '#4657b1');
    renderBarChart('prognosaChart', prognosaData, '#5c6bc0');

    generateCheckbox(tbData,'checkboxTb',(data)=>renderBarChart('tbOutChart',data,'#2e7d32'));
    generateCheckbox(pendidikanData,'checkboxPendidikan',(data)=>renderBarChart('pendidikanChart',data,'#f2994a'));
    generateCheckbox(fasumData,'checkboxFasum',(data)=>renderBarChart('fasumChart',data,'#4657b1'));
    generateCheckbox(prognosaData,'checkboxPrognosa',(data)=>renderBarChart('prognosaChart',data,'#5c6bc0'));

    /* dropdown toggle */
    document.querySelectorAll('.select-box').forEach(box=>{
        box.addEventListener('click',()=>{
            const list = box.nextElementSibling;
            list.style.display = list.style.display === 'block' ? 'none' : 'block';
        });
    });

});
if (sheetName === "RKA") {

  const formatToBillions = (num) => {
    const billion = num / 1000000000;
    return billion.toFixed(2) + "B";
  };

  kpi.forEach(r => {

    const value = Number(r.NILAI || r.PROGRAM || 0);

    if (r.NAMA === "RKA 2024") {
      const el = document.getElementById("rka2024");
      if(el) el.innerText = formatToBillions(value);
    }

    if (r.NAMA === "RKA 2025 EFISIENSI MASUK") {
      const el = document.getElementById("rkaEfisiensi");
      if(el) el.innerText = formatToBillions(value);
    }

    if (r.NAMA === "RKA SO BARU PENETAPAN RKA 2025") {
      const el = document.getElementById("rkaSoBaru");
      if(el) el.innerText = formatToBillions(value);
    }

    if (r.NAMA === "SISA ANGGARAN") {
      const el = document.getElementById("rkaSisa");
      if(el) el.innerText = formatToBillions(value);
    }

    if (r.NAMA === "REALISASI 2025") {
      const el = document.getElementById("rkaRealisasi");
      if(el) el.innerText = formatToBillions(value);
    }

  });

}
