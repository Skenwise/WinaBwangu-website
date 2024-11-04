// Booth location and services map
const boothData = {
    Wina1 : { location: 'Lusaka CPD', services: ['Airtel', 'MTN', 'Zamtel', 'Zanaco', 'FNB'] },
    Wina2 : { location: 'Libala', services: ['Airtel', 'MTN', 'Zamtel', 'FNB'] },
    Wina3 : { location: 'Kabwata', services: ['Airtel', 'MTN', 'Zamtel', 'Zanaco', 'FNB'] },
    Wina4 : { location: 'Mandevu', services: ['Airtel', 'MTN', 'Zamtel'] },
    Wina5 : { location: 'Woodlands', services: ['Airtel', 'MTN', 'Zanaco', 'FNB'] },
    Wina6 : { location: 'Matero East', services: ['Airtel', 'MTN', 'Zamtel'] }
};

// Service revenue per Kwacha map
const serviceRevenue = {
    'Airtel': 0.05,
    'MTN': 0.06,
    'Zamtel': 0.045,
    'Zanaco': 0.035,
    'FNB': 0.04
};

// Handle booth change and update location
function updateLocation() {
    const booth = document.getElementById('boothID').value;
    const locationInput = document.getElementById('location');
    const serviceSelect = document.getElementById('service');

    serviceSelect.innerHTML = '<option value="">--Select--</option>'; // Reset service dropdown

    if (booth) {
        // Update location
        locationInput.value = boothData[booth].location;

        // Populate services based on booth
        boothData[booth].services.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.text = service;
            serviceSelect.add(option);
        });
    } else {
        // Reset location if no booth selected
        locationInput.value = '';
    }
}

// Handle service change and update revenue
function updateRevenue() {
    const service = document.getElementById('service').value;
    const revenueInput = document.getElementById('revenue');

    if (service) {
        revenueInput.value = serviceRevenue[service];  // Set revenue based on service
    } else {
        revenueInput.value = '';  // Reset if no service selected
    }
}

// Process transaction submission
function processTransaction(event) {
    event.preventDefault();

    const boothID = document.getElementById('boothID').value;
    const location = document.getElementById('location').value;
    const serviceID = document.getElementById('service').value;
    const TransactionAmount = document.getElementById('TransactionAmount').value;
    const revenue = document.getElementById('revenue').value;

    // Debugging to check form data
    console.log("Booth:", boothID);
    console.log("Location:", location);
    console.log("Service:", serviceID);
    console.log("Amount:", TransactionAmount);
    console.log("Revenue:", revenue);

    // Debugging log for form data before submission
    console.log("Form Data:", { boothID, location, serviceID, TransactionAmount, revenue });

    if (!boothID || !serviceID || !TransactionAmount || !revenue) {
        alert('Please fill all fields.');
        return;
    }

    const transactionID = `WB${Date.now()}${Math.floor(Math.random() * 1000)}`;  // Unique transaction ID based on timestamp
    const total = TransactionAmount * revenue;

     // Log transaction data to be sent
     console.log("Transaction Data:", { transactionID, boothID, location, serviceID, TransactionAmount, revenue, total });

    console.log("Transaction ID:", transactionID);  // Debugging transaction ID
    console.log("Total:", total);

    // Send transaction to the server (mock example)
    fetch('http://localhost:3000/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionID, boothID, location, serviceID, TransactionAmount, revenue, total })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Server Response:", data);  // Debugging server response
        alert('Transaction saved successfully.');
    });
}
