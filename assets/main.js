


    const rowsPerPage = 7;
    let currentPage = 1;
    let fullData = [];

    document.addEventListener('DOMContentLoaded', function () {
        const tableBody = document.getElementById('victim-table-body');
        const searchInput = document.getElementById('search');
        const searchBtn = document.getElementById('search-btn');
        const filterDistrict = document.getElementById('filter-district');
        const filterPerp = document.getElementById('filter-perpetrator');
        const filterRegion = document.getElementById('filter-region');

        async function loadData() {
            const res = await fetch('july-massacre-confirmed-list.json');
            const data = await res.json();
            fullData = data;

            populateFilterOptions(data);
            applyFiltersAndRender();

            searchInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') applyFiltersAndRender();
            });
            filterDistrict.addEventListener('change', applyFiltersAndRender);
            filterPerp.addEventListener('change', applyFiltersAndRender);
            filterRegion.addEventListener('change', applyFiltersAndRender);
        }

        function populateFilterOptions(data) {
            const districts = new Set();
            const perpetrators = new Set();
            const regions = new Set();

            let hasRegion = false;

            data.forEach(entry => {
                if (entry.District) districts.add(entry.District);
                if (entry.AllegedPerpetrator) perpetrators.add(entry.AllegedPerpetrator);
                if (entry.Region && entry.Region.trim() !== '') {
                    regions.add(entry.Region);
                    hasRegion = true;
                }
            });

            if (!hasRegion) {
                document.getElementById('filter-region').parentElement.style.display = 'none';
            }

            fillSelect(filterDistrict, districts);
            fillSelect(filterPerp, perpetrators);
            fillSelect(filterRegion, regions);
        }

        function fillSelect(select, values) {
            [...values].sort().forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                select.appendChild(option);
            });
        }

        function applyFiltersAndRender() {
            const query = searchInput.value.toLowerCase();
            const selectedDistrict = filterDistrict.value;
            const selectedPerp = filterPerp.value;
            const selectedRegion = filterRegion.value;

            const filtered = fullData.filter(entry => {
                const matchesSearch =
                    entry.Victim.toLowerCase().includes(query) ||
                    entry.District.toLowerCase().includes(query) ||
                    entry.AllegedPerpetrator.toLowerCase().includes(query);

                const matchesDistrict = !selectedDistrict || entry.District === selectedDistrict;
                const matchesPerp = !selectedPerp || entry.AllegedPerpetrator === selectedPerp;
                const matchesRegion = !selectedRegion || entry.Region === selectedRegion;

                return matchesSearch && matchesDistrict && matchesPerp && matchesRegion;
            });

            renderPaginatedRows(filtered, 1);
        }

        function renderPaginatedRows(data, page) {
            currentPage = page;
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const sliced = data.slice(start, end);

            tableBody.innerHTML = '';
            sliced.forEach(entry => {
                const row = `
                    <tr>
                        <td class="medical-id">${String(entry.MedicalCaseID).padStart(3, '0')}</td>
                        <td class="victim">${entry.Victim}</td>
                        <td>${entry.Region || entry.District}</td>
                        <td>${entry.AllegedPerpetrator}</td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });

            renderPagination(data.length);
        }

        function renderPagination(totalRows) {
            const pagination = document.querySelector('.pagination');
            const totalPages = Math.ceil(totalRows / rowsPerPage);
            pagination.innerHTML = '';

            if (totalPages <= 1) return;

            const makePageButton = (page, label = null) => {
                const span = document.createElement('span');
                span.textContent = label || page;
                if (page === currentPage) span.style.fontWeight = 'bold';
                span.style.cursor = 'pointer';
                span.onclick = () => applyFiltersAndRenderWithPage(page);
                return span;
            };

            const maxPagesToShow = 6;
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = startPage + maxPagesToShow - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            if (currentPage > 1) {
                pagination.append(makePageButton(currentPage - 1, '<'));
            }

            if (startPage > 1) {
                pagination.append(makePageButton(1));
                if (startPage > 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '…';
                    pagination.append(ellipsis);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pagination.append(makePageButton(i));
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '…';
                    pagination.append(ellipsis);
                }
                pagination.append(makePageButton(totalPages));
            }

            if (currentPage < totalPages) {
                pagination.append(makePageButton(currentPage + 1, '>'));
            }
        }

        function applyFiltersAndRenderWithPage(page) {
            const query = searchInput.value.toLowerCase();
            const selectedDistrict = filterDistrict.value;
            const selectedPerp = filterPerp.value;
            const selectedRegion = filterRegion.value;

            const filtered = fullData.filter(entry => {
                const matchesSearch =
                    entry.Victim.toLowerCase().includes(query) ||
                    entry.District.toLowerCase().includes(query) ||
                    entry.AllegedPerpetrator.toLowerCase().includes(query);

                const matchesDistrict = !selectedDistrict || entry.District === selectedDistrict;
                const matchesPerp = !selectedPerp || entry.AllegedPerpetrator === selectedPerp;
                const matchesRegion = !selectedRegion || entry.Region === selectedRegion;

                return matchesSearch && matchesDistrict && matchesPerp && matchesRegion;
            });

            renderPaginatedRows(filtered, page);
        }

        loadData();
    });



    
        const ctx = document.getElementById('deathTollChart').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [
                    'Jul 16', 'Jul 17', 'Jul 18', 'Jul 19', 'Jul 20', 'Jul 21',
                    'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25', 'Jul 26', 'Jul 27',
                    'Jul 28', 'Jul 29', 'Jul 30', 'Jul 31', 'Aug 1', 'Aug 2',
                    'Aug 3', 'Aug 4', 'Aug 5'
                ],

                
                datasets: [{
                    label: 'Daily Deaths',
                    data: [5, 2, 53, 179, 66, 20, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 108, 267],
                    borderColor: '#cc0000',
                    borderWidth: 3,
                    pointBackgroundColor: '#cc0000',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: false,
                    tension: 0.0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 10 // tighten bottom space
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: '#eee',
                            lineWidth: 0.5,
                            drawBorder: false,
                            borderDash: [4, 4] // dashed vertical grid lines
                        },
                        ticks: {
                            font: {
                                family: "'ibm-plex-mono', monospace",
                                size: 12
                            },
                            padding: 10,
                            callback: function (value, index, ticks) {
                                return this.getLabelForValue(value);
                            }
                        }
                    },
                    y: {
  min: -50,              // Lower bound to lift 0 up
  beginAtZero: true,     // Still allows nice tick generation
  grid: {
    color: '#eee',
    lineWidth: 0.5,
    borderDash: [4, 4]
    // Chart.js v3+ removed zeroLineColor support
  },
  ticks: {
    font: {
      family: "'ibm-plex-mono', monospace",
      size: 12
    },
    callback: function(value) {
      return value < 0 ? '' : value; // Hide tick labels below 0
    }
  }
}

                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => `Deaths: ${context.parsed.y}`
                        }
                    }
                }
            }
            ,
            plugins: [{
                id: 'customDecoration',
                beforeDraw: chart => {
                    const { ctx, chartArea, scales } = chart;
                    const xScale = scales.x;
                    const yBottom = chartArea.bottom;
                    const tickLabels = chart.data.labels;
                    const highlightLabel = 'Jul 17';

                    // Draw vertical lines for specific dates
                    const labelToColor = {
                        'Jul 17': '#000',
                        'Jul 18': '#ffbb33',
                        'Jul 19': '#cc0000',
                        'Jul 20': '#3399ff'
                    };

                    tickLabels.forEach((label, i) => {
                        const x = xScale.getPixelForTick(i);
                        if (labelToColor[label]) {
                            ctx.save();
                            ctx.beginPath();
                            ctx.strokeStyle = labelToColor[label];
                            ctx.lineWidth = 1.5;
                            ctx.moveTo(x, chartArea.top);
                            ctx.lineTo(x, chartArea.bottom);
                            ctx.stroke();
                            ctx.restore();
                        }
                    });

                    // Draw bottom gray bar
                    ctx.save();
                    ctx.fillStyle = '#e0e0e0';
                    ctx.fillRect(chartArea.left, yBottom + 0, chartArea.width, 20);
                    ctx.restore();

                    // Draw dots above each tick + label boxes
                    tickLabels.forEach((label, i) => {
                        const x = xScale.getPixelForTick(i);

                        // dot above tick
                        ctx.beginPath();
                        ctx.arc(x, yBottom + 10, 3, 0, 2 * Math.PI);
                        ctx.fillStyle = '#888';
                        ctx.fill();


                    });
                }
            }]
        });
    

    
        fetch('july-massacre-cause-of-death.json')
            .then(res => res.json())
            .then(json => {
                const data = json.Data;

                const nonZero = data.filter(d => d.GrandTotal > 0);
                const barLabels = nonZero.map(d => d.Date);
                const barData = nonZero.map(d => d.GrandTotal);


                const pieTotal = { Shot: 0, Stabbed: 0, Beaten: 0, Others: 0 };
                data.forEach(d => {
                    for (const key in d.Cause) {
                        pieTotal[key] += d.Cause[key];
                    }
                });
const sorted = Object.entries(pieTotal).sort((a, b) => b[1] - a[1]);
const pieLabels = sorted.map(d => d[0]);
const pieData = sorted.map(d => d[1]);

const pieColors = ['#B00000', '#F12945', '#F6959E', '#DED5D5'];


                new Chart(document.getElementById('barChart').getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: barLabels,
                        datasets: [{
                            data: barData,
                            backgroundColor: '#E40000', // or any from your 6-color palette
                            borderRadius: 0
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                ticks: {
                                    font: { family: 'ibm-plex-mono', size: 12 }
                                }
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    font: { family: 'ibm-plex-mono', size: 12 }
                                }
                            }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });

                new Chart(document.getElementById('pieChart').getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: pieLabels,
                        datasets: [{
                            data: pieData,
                            backgroundColor: pieColors
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            });
    


    
        const values = [107, 66, 62, 56, 40, 36, 25, 19];
        const labels = ["Wari", "Uttara", "Mirpur", "Gulshan", "Motijhil",
            "Tejgaon", "Ramna", "Lalbagh"];

        const data = [{
            type: "treemap",
            labels,
            parents: Array(values.length).fill(""),
            values,
            textinfo: "label+value",
            hoverinfo: "skip",                        // no hover events
            
            marker: {
    colors: values,
    opacity: 0,
    colorscale: [
        [0.0, '#CCCCCC'],   // light gray
        [0.2, '#D99999'],
        [0.4, '#E06666'],
        [0.6, '#CC3333'],
        [0.8, '#B30000'],
        [1.0, '#800000']    // deep red
    ],
    colorbar: {
        title: "Fatalities",
        orientation: "h",
        x: 0.5, xanchor: "center", y: 1.15,
        len: 0.8, thickness: 20, outlinewidth: 0,
        tickfont: { family: "ibm-plex-mono", size: 12, color: "#000" },
        titlefont: { family: "ibm-plex-mono", size: 12, color: "#000" }
    },
    line: { width: 0 }
}

        }];

        const layout = {
            margin: { t: 0, l: 0, r: 0, b: 0 },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)"
        };

        const config = {
            displayModeBar: false,
            displaylogo: false,
            responsive: true,
            staticPlot: true                    // disables hover / click
        };

        Plotly.newPlot("heatmapChart", data, layout, config).then(() => {

            /* centre every label */
            document.querySelectorAll('#heatmapChart .slice').forEach(slice => {
                const path = slice.querySelector('path.surface');
                const txt = slice.querySelector('text.slicetext');
                if (path && txt) {
                    const m = path.getAttribute('d').match(/M([\d.]+),([\d.]+)L([\d.]+),([\d.]+)/);
                    if (m) {
                        const [, x1, y1, x2, y2] = m.map(Number);
                        const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
                        requestAnimationFrame(() => {
                            const h = txt.getBBox().height || 0;
                            txt.setAttribute('transform', `translate(${cx},${cy + h / 2})`);
                            txt.setAttribute('text-anchor', 'middle');
                        });
                    }
                }
            });

            /* one-time style cleanup */
            document.querySelectorAll('#heatmapChart path.surface').forEach((p, idx) => {
                let s = p.getAttribute('style') || '';

                /* remove strokes */
                s = s
                    .replace(/stroke:\s*[^;]+;/gi, '')
                    .replace(/stroke-width:\s*[^;]+;/gi, '')
                    .replace(/stroke-opacity:\s*[^;]+;/gi, '');

                /* if this path is the dark-grey filler block, make it transparent */
                if (/rgb\(68,\s*68,\s*68\)/i.test(s)) {
                    s = s.replace(/rgb\(68,\s*68,\s*68\)/gi, 'transparent');
                    s = /fill-opacity:/i.test(s)
                        ? s.replace(/fill-opacity:\s*[^;]+;/i, 'fill-opacity: 0;')
                        : s + ' fill-opacity: 0;';
                }

                p.setAttribute('style', s.trim());
            });
        });
    



  // 1 dot = 10 victims
  const UNIT = 10;

  fetch('july-massacre-generations.json')
    .then(res => res.json())
    .then(data => {
      const chart = document.getElementById('gen-chart');

      data.forEach(gen => {
        /* card wrapper */
        const block = document.createElement('div');
        block.className = 'gen-block';

        /* 👉 store the percentage in a data‑attribute for CSS tooltip */
        block.setAttribute('data-tooltip', `${gen.Percentage}% of total`);

        /* grid of dots */
        const grid = document.createElement('div');
        grid.className = 'dot-grid';

        const dots = Math.round(gen.Victims / UNIT);
        for (let i = 0; i < dots; i++) {
          const dot = document.createElement('span');
          dot.className = 'dot';
          grid.appendChild(dot);
        }

        /* label */
        const label = document.createElement('p');
        label.className = 'gen-label';
        label.textContent = gen.Generation;

        /* assemble */
        block.appendChild(grid);
        block.appendChild(label);
        chart.appendChild(block);
      });
    });




document.addEventListener('DOMContentLoaded', () => {
  fetch('july-massacre-perpetrators-active.json')
    .then(res => res.json())
    .then(data => {
      const labels = data.map(entry => entry["Alleged Perpetrator"]);

      const categories = [
        "RAB", "Police-BGB", "Police-AL", "Police", "Magistrate",
        "BGB", "Awami League", "Army", "Ansar"
      ];

      const colorMap = {
        "RAB": "#DED5D5",
        "Police": "#F12945",
        "Police-BGB": "#B89B9B",
        "Police-AL": "#F6959E",
        "BGB": "#B00000",
        "Awami League": "#E40000",
        "Army": "#CC0000",
        "Ansar": "#EB6C6E",
        "Magistrate": "#660000"
      };

      const datasets = categories.map(category => ({
        label: category,
        backgroundColor: colorMap[category],
        data: data.map(d => Number(d[category]) || 0),
        borderWidth: 0
      }));

      new Chart(document.getElementById('perpetratorChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels,
          datasets
        },
        options: {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        font: {
          family: 'ibm-plex-mono',
          size: 12
        }
      }
    },
    tooltip: {
      bodyFont: {
        family: 'ibm-plex-mono'
      },
      titleFont: {
        family: 'ibm-plex-mono'
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        font: {
          family: 'ibm-plex-mono'
        }
      }
    },
    y: {
      stacked: true,
      ticks: {
        font: {
          family: 'ibm-plex-mono'
        }
      }
    }
  }
}


      });
    });
});





// ====================  CHOROPLETH LOGIC  ====================
let geoData, rows, dayKeys=[], dayLookup={};

Promise.all([
  fetch('bangladesh-districts.geojson').then(r=>r.json()),
  fetch('july-massacre-map.json').then(r=>r.json())
]).then(([geo,json])=>{
  geoData=geo;
  rows=json.map(r=>{const o={};for(const[k,v] of Object.entries(r)){const val=k==='District'?v.trim():(v===''?0:+v);o[k.trim()]=val; if(k!=='District'&&!dayKeys.includes(k.trim())) dayKeys.push(k.trim());}return o;});
  buildIndex(); drawMap(); initObserver();
});
const customColors = d3.scaleLinear()
  .domain([
    0.0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0
  ])
  .range([
    '#CC0000', '#EB6C6E', '#660000', '#DED5D5', '#B89B9B',
    '#F12945', '#F6959E', '#B00000', '#E40000'
  ]);

const svg=d3.select('#bd-map');
const path=d3.geoPath().projection(d3.geoMercator().center([90.4,23.7]).scale(4500).translate([400,400]));
const tip=d3.select('#tooltip');
const canon=s=> (s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z]/g,'');
const dName=p=> p.ADM2_EN||p.DIST_NAME||p.NAME_2||p.NAME_1||p.NAME_0||'';

function buildIndex(){ dayKeys.forEach(day=>{const o={};rows.forEach(r=>o[canon(r.District)]=r[day]||0);dayLookup[day]=o;}); }

function drawMap(){
  const isSmallPortrait = window.innerWidth < 500 && window.innerHeight > window.innerWidth;
  svg.attr('viewBox', isSmallPortrait ? '150 200 500 500' : '0 0 800 800');

  svg.selectAll('path').data(geoData.features).join('path')
    .attr('d', path)
    .attr('stroke', '#999')
    .attr('stroke-width', 0.5)
    .attr('data-canon', d => canon(dName(d.properties)));

  const first = dayKeys.find(d => d3.max(rows, r => r[d]) > 0) || dayKeys[0];
  updateMap(first);
}


function updateMap(day){
  const vals = dayLookup[day] || {};
  const max = d3.max(Object.values(vals));

  const customColors = d3.scaleLinear()
    .domain([
      0.0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1.0
    ])
    .range([
      '#CC0000', '#EB6C6E', '#660000', '#DED5D5', '#B89B9B',
      '#F12945', '#F6959E', '#B00000', '#E40000'
    ]);

  const col = v => {
    if (!v || v === 0) return '#ccc'; // gray for missing/zero
    return customColors(v / (max || 1));
  };

  svg.selectAll('path').transition().duration(400)
    .attr('fill', function() {
      return col(vals[this.dataset.canon] || 0);
    });

  svg.selectAll('path')
    .on('mouseover', function(e, d) {
      d3.select(this).attr('stroke-width', 2).raise();
      tip.html(`<strong>${dName(d.properties)}</strong><br>${vals[this.dataset.canon] || 0}`)
         .style('display', 'block');
    })
    .on('mousemove', e => tip.style('left', e.pageX + 12 + 'px').style('top', e.pageY - 28 + 'px'))
    .on('mouseleave', function() {
      d3.select(this).attr('stroke-width', 0.5);
      tip.style('display', 'none');
    });
}


// scroll‑triggered day change
function initObserver(){
  const obs=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting&&updateMap(e.target.dataset.day));},{threshold:0.6});
  document.querySelectorAll('.scroll-text').forEach(el=>obs.observe(el));
}

// sticky release when bottom sentinel hits viewport
(function(){
 const map=document.getElementById('map-container');
 const sentinel=document.getElementById('scrolly-end');
 new IntersectionObserver(entries=>{
   entries.forEach(e=>{map.style.position=e.isIntersecting?'static':'sticky';});
 },{root:null,threshold:0}).observe(sentinel);
})();




    // show more tab //
    document.addEventListener('DOMContentLoaded', function () {
      const expandingBox = document.getElementById('expandingBox');
      const boxContent = document.getElementById('boxContent');
      const toggleBtn = document.getElementById('toggleBtn');

      let isOpen = false; // Initial state: closed
      const closedHeight = getComputedStyle(boxContent).getPropertyValue("--closed-height").trim();

      // Set initial closed state
      boxContent.style.setProperty("--max-height", closedHeight);

      toggleBtn.addEventListener('click', toggle);

      function toggle() {
        if (!isOpen) {
          boxContent.style.setProperty("--max-height", `${boxContent.scrollHeight}px`);
          toggleBtn.textContent = "Collapse —";
        } else {
          boxContent.style.setProperty("--max-height", closedHeight);
          toggleBtn.textContent = "Expand +";
        }

        isOpen = !isOpen;
      }
    });


