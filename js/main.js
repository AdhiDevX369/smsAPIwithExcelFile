document.getElementById('uploadButton').addEventListener('click', function () {
    let inputFile = document.getElementById('inputFile');
    if (inputFile.files.length === 0) {
        alert('Please select a file!');
        return;
    }

    console.log('File selected, starting processing...');
    let fileReader = new FileReader();
    let file = inputFile.files[0];
    fileReader.readAsBinaryString(file);

    fileReader.onload = function (event) {
        let data = event.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        let empIds = [];
        workbook.SheetNames.forEach(sheet => {
            let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            rowObject.forEach(row => {
                if (row['USER ID']) {
                    empIds.push(row['USER ID']);
                }
            });
        });
        console.log('Sending following IDs to server:', empIds);
        sendJSONToBackend(empIds);
    };

    fileReader.onerror = function () {
        console.error('There was an error reading the file!');
    };
});



function showOverlay() {
    document.getElementById('overlay').style.display = 'flex'; // Use 'overlay' instead of 'center-spinner'
}

function hideOverlay() {
    document.getElementById('overlay').style.display = 'none';
}


function sendJSONToBackend(empIds) {
    showOverlay();
    let url = 'php/search_num.php';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(empIds),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response received from server:', data);
        hideOverlay();
        if (data.phoneNumbers) {
            console.log('Displaying phone numbers:', data.phoneNumbers);
            displayPhoneNumbers(data.phoneNumbers);
        }
    })
    .catch((error) => {
        console.error('Error during fetch:', error);
        hideOverlay();
    });
}

function displayPhoneNumbers(phoneNumbers) {
    const container = document.getElementById('phoneNumbersContainer');
    container.innerHTML = ''; // Clear previous content

    phoneNumbers.forEach(number => {
        const numberBox = document.createElement('div');
        numberBox.classList.add('phone-number-box');
        numberBox.textContent = number;
        container.appendChild(numberBox);
    });
    console.log('Phone numbers displayed');
}


document.getElementById('sendSMSButton').addEventListener('click', function() {
    // Collect phone numbers
    const phoneNumbers = Array.from(document.querySelectorAll('.phone-number-box'))
                               .map(box => box.textContent.trim())
                               .filter(number => number !== '');

    // Get the message
    const message = document.getElementById('smsMessage').value;

    if (phoneNumbers.length === 0 || message.trim() === '') {
        alert('Please enter both a message and at least one phone number.');
        return;
    }

    sendSMS(phoneNumbers, message);
});

function sendSMS(phoneNumbers, message) {
    showOverlay(); // Optional: Show a loading overlay

    const url = 'php/process_sms.php'; // Set this to your backend endpoint
    const payload = { phoneNumbers, message };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('SMS sent:', data);
        // Handle successful response
        alert('SMS sent successfully!');
    })
    .catch(error => {
        console.error('Error sending SMS:', error);
        // Handle error
        alert('Failed to send SMS.');
    })
    .finally(() => {
        hideOverlay(); // Hide the loading overlay
    });
}
