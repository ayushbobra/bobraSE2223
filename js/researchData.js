// Graph CSV data with chart.js 

// Parse the CSV data into the necessary arrays

async function getData() {
    const response = await fetch('data/researchData.csv');
    const data = await response.text();  // Get the CSV data in TEXT format

    const days = []; //x-axis labels = years
    const bin5 = []; //y-axis labels = temp deviation
    const bin6 = [];
    const bin7 = [];

    const table = data.split('\n').slice(1);  // Split by line and remove the 0th row
    table.forEach(row => {               // Operate on each row
        const columns = row.split(',');  // Separate each row into columns

        const day = columns[0];        // assign year values
        days.push(day);              // push year values to xYears array
        
        const temp = parseFloat(columns[1]);        // global temp deviation
        bin5.push(temp);               // push temp values to yTemp array

        const nHtemp = parseFloat(columns[2]);      // northern hemisphere temp deviation
        bin6.push(nHtemp);      
        const sHtemp = parseFloat(columns[3]);      // southern hemisphere temp deviation
        bin7.push(sHtemp);
    });
    return {days, bin5, bin6, bin7};
}

async function createChart() {
    const data = await getData(); // Wait for the data to be parsed
    const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.days,
        datasets: [
            {
                label: 'Number of Earthworms in Bin 5',
                data: data.bin5,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Number of Earthworms in Bin 6',
                data: data.bin6,
                backgroundColor: 'rgba(87, 255, 145, 0.2)',
                borderColor: 'rgba(87, 255, 145, 1)',
                borderWidth: 1
            },
            {
                label: 'Number of Earthworms in Bin 7',
                data: data.bin7,
                backgroundColor: 'rgba(0, 99, 255, 0.2)',
                borderColor: 'rgba(0, 99, 255, 1)',
                borderWidth: 1
            }
        ]

    },
    options: {
        responsive: true,                   // Re-size based on screen size
        scales: {                           // x & y axes display options
            x: {
                title: {
                    display: true,
                    text: 'Day',
                    font: {
                        size: 20
                    },
                }
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Number of Earthworms',
                    font: {
                        size: 20
                    },
                }
            }
        },
        plugins: {                          // title and legend display options
            title: {
                display: true,
                text: 'Daily Number of Eisenia hortensis Present in Each Bin',
                font: {
                    size: 24
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            legend: {
                position: 'bottom'
            }
        }
    }
});

}

createChart();