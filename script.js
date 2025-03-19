

function loadData() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please upload a CSV file!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        console.log("File uploaded:", file.name);
        const data = event.target.result;
        const parsedData = processCSV(data, file.name);
        plotCharts(parsedData);
    };

    reader.readAsText(file);
}

function processCSV(data, fileName) {
    const rows = data.split("\n").slice(1); // Skip header
    let labels = [];
    let values = [];

    rows.forEach(row => {
        const parts = row.split(",");
        if (parts.length === 2) {
            labels.push(parts[0].trim());
            values.push(parseInt(parts[1].trim()));
        }
    });

    // Set exact predictions for 2025 based on your given values
    let predicted2025;
    if (fileName.includes("ncr")) predicted2025 = 4063;
    else if (fileName.includes("central_luzon")) predicted2025 = 1874;
    else if (fileName.includes("calabarzon")) predicted2025 = 3051;
    else if (fileName.includes("philippines")) predicted2025 = 17794;
    else predicted2025 = Math.round(values[values.length - 1] * 1.05); // Default increase

    labels.push("2025");
    values.push(predicted2025);

    return { labels, values, predicted2025Index: labels.length - 1 };
}

function plotCharts(data) {
    const lineCtx = document.getElementById("sarimaChart").getContext("2d");
    const barCtx = document.getElementById("barChart").getContext("2d");

    new Chart(lineCtx, {
        type: "line",
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "HIV Cases (Line Chart)",
                    data: data.values,
                    borderColor: "blue",
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: data.labels.map((_, index) => index === data.predicted2025Index ? "red" : "blue"),
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Year" } },
                y: { title: { display: true, text: "Cases" } }
            }
        }
    });

    new Chart(barCtx, {
        type: "bar",
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: "HIV Cases (Bar Chart)",
                    data: data.values,
                    backgroundColor: data.labels.map((_, index) => index === data.predicted2025Index ? "red" : "blue"),
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Year" } },
                y: { title: { display: true, text: "Cases" } }
            }
        }
    });
}

function openModal() {
    document.getElementById("aboutModal").style.display = "block";
    document.getElementById("mainContent").style.display = "none";
}

function closeModal() {
    document.getElementById("aboutModal").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
}