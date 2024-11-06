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
    const taxRate = 0.16;  //16% Tax rate
    const totalAfterTax = total + (total * taxRate); //calculate total after rate

    // set total and totalAfterTax in the form 
    document.getElementById('total').value = total.toFixed(2);
    document.getElementById('totalAfterTax').value = totalAfterTax.toFixed(2);

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

//Client-side JavaScript for handling transactions and displaying tax performance
document.addEventListener('DOMContentLoaded', function() {
    // Fetch transactions from the API when the button is clicked
    document.getElementById('fetchTransactions').addEventListener('click', function() {
        const container = document.getElementById('transactionsContainer');
        const taxPerformanceContainer = document.getElementById('taxPerformanceContainer');
        const loadingMessage = document.createElement('p')
        loadingMessage.textContent = 'Loading transactions...';
        container.appendChild(loadingMessage);  // show loading message


        fetch('http://localhost:3000/api/transactions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data fetched:', data); // Log the fetched data
                container.innerHTML = ''; //clear previous transactions
                loadingMessage.remove();  // remove loading message

                // Check if the container exists before modifying it
                if (container) {
                    container.innerHTML = ''; // Clear previous transactions
                    if (data.length === 0) {
                        container.innerHTML = '<p>No transactions found.</p>'; // Inform if no transactions
                    } else {

                        let totalTax = 0;  // initialize total tax variable


                        data.forEach(transaction => {
                            const transactionDiv = document.createElement('div');
                            const transactionAmount = parseFloat(transaction.TransactionAmount);
                            const taxAmount = transactionAmount * 0.16; //16% tax rate
                            totalTax += taxAmount; // Add to total tax

                            transactionDiv.innerHTML = `
                                <p>Transaction ID: ${transaction.TransactionID}</p>
                                <p>Booth ID: ${transaction.BoothID}</p>
                                <p>Service ID: ${transaction.ServiceID}</p>
                                <p>Transaction Amount: ${transactionAmount.toFixed(2)}</p>
                                <p>Tax Amount: ${taxAmount.toFixed(2)}</p> <!-- Display tax amount -->
                                <p>Location: ${transaction.location}</p>
                                <p>Revenue: ${transaction.revenue}</p>
                                <p>Total: ${transaction.total}</p>
                                <hr>
                            `;
                            container.appendChild(transactionDiv);
                        });

                        // Create data bar for total tax
                        taxPerformanceContainer.innerHTML = `
                            <div style="width: ${totalTax}px; height: 30px; background-color: #4CAF50;">
                                Total Tax Obligations: ${totalTax.toFixed(2)} (16% of Transactions)
                            </div>
                        `;
                    }
                } else {
                    console.error('Container element not found.'); // Log error if container is not found
                }
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
            });
    });
});

//  monthly limit for each service
const serviceLimits = {
    'Airtel Money': 350000, // Monthly limit for Airtel Money
    'MTN Money': 160000, // Monthly limit for MTN Money
    'Zamtel Money': 70000,  // Monthly limit for Zamtel
    'Zanaco':80000,         // Monthly limit for Zanaco
    'FNB' : 80000           // Monthly limit for FNB
};

// Function to calculate cumulative totals and remaining amounts
function calculateTotals(transactions) {
    const cumulativeTotals = {};

    // Calculate cumulative totals for each service
    transactions.forEach(transaction => {
        const serviceID = transaction.ServiceID;
        const amount = parseFloat(transaction.TransactionAmount);

        if (!cumulativeTotals[serviceID]) {
            cumulativeTotals[serviceID] = 0;
        }

        cumulativeTotals[serviceID] += amount;
    });

    // Calculate remaining amounts and log results
    Object.keys(serviceLimits).forEach(serviceID => {
        const monthlyLimit = serviceLimits[serviceID];
        const totalSpent = cumulativeTotals[serviceID] || 0;
        const remainingAmount = monthlyLimit - totalSpent;

        console.log(`Service ID: ${serviceID}`);
        console.log(`Cumulative Total: ${totalSpent}`);
        console.log(`Remaining Amount: ${remainingAmount}`);
    });
}

// transaction data 
const transactions = [
    { ServiceID: 'Airtel Money', TransactionAmount: 350000 },
    { ServiceID: 'MTN Money', TransactionAmount: 160000 },
    { ServiceID: 'Zamtel Money', TransactionAmount: 70000 },
    { ServiceID: 'Zanaco', TransactionAmount: 80000 },
    { ServiceID: 'FNB', TransactionAmount: 80000 },
];

// Call the function 
calculateTotals(transactions);

function displayResults() {
    const container = document.getElementById('serviceTotalsContainer');
    container.innerHTML = ''; // Clear previous data

    Object.keys(serviceLimits).forEach(serviceID => {
        const monthlyLimit = serviceLimits[serviceID];
        const totalSpent = cumulativeTotals[serviceID] || 0;
        const remainingAmount = monthlyLimit - totalSpent;

        const serviceDiv = document.createElement('div');
        serviceDiv.innerHTML = `
            <h3>Service ID: ${serviceID}</h3>
            <p>Cumulative Total: ${totalSpent.toFixed(2)} kwacha</p>
            <p>Remaining Amount: ${remainingAmount.toFixed(2)} kwacha</p>
            <hr>
        `;
        container.appendChild(serviceDiv);
    });
}

// call the function
displayResults();

