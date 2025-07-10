console.log("This is my script");

// Get references to the submit button and the result container
const submitBtn = document.getElementById("submitBtn");
const resultCont = document.getElementById("resultCont");
const usernameInput = document.getElementById("username"); // Reference to the email input field

// Add an event listener to the submit button
submitBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("Button clicked!");

    // Display a loading indicator
    resultCont.innerHTML = `<img width="233" src="img/loading.svg" alt="Loading...">`;

    // Your EmailValidation.io API Key (replace with your actual key if different)
    const apiKey = "ema_live_lrJhETAuFboL803GEvyf2jXftza7EG3gPHn7okgt";
    const email = usernameInput.value; // Get the email entered by the user

    // Construct the API URL
    const url = `https://api.emailvalidation.io/v1/info?apikey=${apiKey}&email=${email}`;

    try {
        // Fetch data from the EmailValidation.io API
        const response = await fetch(url);

        // Check if the network request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}. Please try again later.`);
        }

        // Parse the JSON response
        const result = await response.json();

        // Build the HTML string to display results
        let htmlString = `<div class="results-container">`; // Added a container div for styling

        // Define the display order and custom labels for the fields
        const displayFields = {
            "email": "Email Address",
            "state": "State",
            "reason": "Reason",
            "domain": "Domain",
            "user": "User",
            "tag": "Tag",
            "format_valid": "Format Valid",
            "mx_found": "MX Record Found",
            "smtp_check": "SMTP Check Valid",
            "score": "Score",
            "free": "Free Email Service",
            "disposable": "Disposable Email",
            "catch_all": "Catch-All Domain",
            "role": "Role-based Email"
        };

        // Iterate through the desired display fields
        for (const apiField in displayFields) {
            if (Object.hasOwnProperty.call(displayFields, apiField)) {
                const displayLabel = displayFields[apiField];
                let value = result[apiField]; // Get the raw value from the API response
                let formattedValue = value; // Initialize formattedValue with raw value

                // --- Custom formatting logic based on field type and value ---

                // Special handling for null or empty string values, render as '-'
                if (value === null || value === "" || value === undefined) {
                    formattedValue = "-";
                }
                
                // For boolean fields (true/false)
                else if (typeof value === 'boolean') {
                    if (value === true) {
                        if (apiField === "smtp_check") {
                            formattedValue = `<span class="status-success icon-text-pair"><img src="img/check-circle.svg" alt="Valid" class="icon"> can receive email</span>`;
                        } else {
                            formattedValue = `<span class="status-success icon-text-pair"><img src="img/check-circle.svg" alt="Valid" class="icon"> Yes</span>`;
                        }
                    } else {
                        formattedValue = `<span class="status-failure icon-text-pair"><img src="img/x-circle.svg" alt="Invalid" class="icon"> No</span>`;
                    }
                } 
                // For 'state' and 'reason' fields - NEW COLOR LOGIC
                else if (apiField === "state") {
                    if (String(value).toUpperCase() === "DELIVERABLE") {
                        formattedValue = `<span class="status-success">${String(value).toUpperCase()}</span>`;
                    } else if (String(value).toUpperCase() === "UNDELIVERABLE") {
                        formattedValue = `<span class="status-failure">${String(value).toUpperCase()}</span>`;
                    } else {
                        formattedValue = String(value).toUpperCase(); // Default if neither
                    }
                }
                else if (apiField === "reason") {
                    if (String(value).toUpperCase() === "VALID_MAILBOX") {
                        formattedValue = `<span class="status-success">${String(value).toUpperCase()}</span>`;
                    } else if (String(value).toUpperCase() === "INVALID_MAILBOX") {
                        formattedValue = `<span class="status-failure">${String(value).toUpperCase()}</span>`;
                    } else {
                        formattedValue = String(value).toUpperCase(); // Default if neither
                    }
                }
                // For 'score' field, ensure it's displayed nicely
                else if (apiField === "score") {
                    formattedValue = value.toFixed(2); // Format score to two decimal places
                }
                // Default for other string/number fields (already handled by initial null/empty check)
                else {
                    formattedValue = value; // Use raw value if no specific formatting
                }


                htmlString += `
                    <div class="result-row">
                        <div class="result-label">${displayLabel}:</div>
                        <div class="result-value">${formattedValue}</div>
                    </div>
                `;
            }
        }

        htmlString += `</div>`; // Close the container div
        
        // Add "Thank You" at the end of the results
        htmlString += `<p style="text-align: center; margin-top: 20px; font-weight: bold; font-size: 1.1em;">Thank You</p>`;


        console.log(htmlString);
        resultCont.innerHTML = htmlString; // Display the results in the result container

    } catch (error) {
        // Handle any errors during the fetch operation (e.e.g., network issues, API errors)
        console.error("Error fetching email validation data:", error);
        resultCont.innerHTML = `<div style="color: red; padding: 20px;">
                                    <strong>Error:</strong> ${error.message}.
                                    Please ensure your API key is correct and you have an active internet connection.
                                </div>`;
    }
});