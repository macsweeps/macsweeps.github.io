// Global variables to store start time, stop time, and sweep duration
let startTime;
let stopTime;
let duration;

// Function to scroll to the respective section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error(`Section with ID ${sectionId} not found.`);
    }
}

// Function to format time to '4:15 pm' or '12:00 am'
function formatTime(date) {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Function to format date to 'Wednesday, 28 2024'
function formatDate(date) {
    const options = { weekday: 'long', day: 'numeric', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Function to format duration to 'minutes and seconds'
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute(s) and ${remainingSeconds} second(s)`;
}

// Function to start the sweep
function startSweep() {
    startTime = new Date();
    document.getElementById('startSweepBtn').style.backgroundColor = 'green';
    document.getElementById('footerSection').classList.remove('hidden');
    document.getElementById('stopSweepBtn').classList.remove('hidden');
    document.getElementById('copyReportBtn').classList.add('hidden');
}

// Function to stop the sweep
function stopSweep() {
    stopTime = new Date();
    duration = Math.floor((stopTime - startTime) / 1000); // Duration in seconds
    document.getElementById('stopSweepBtn').classList.add('hidden');
    document.getElementById('copyReportBtn').classList.remove('hidden');
}

// Function to clear the form
function clearForm() {
    // Reset the start button and footer
    document.getElementById('startSweepBtn').style.backgroundColor = '';
    document.getElementById('footerSection').classList.add('hidden');

    // Reset all input fields and buttons to default
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '0');
    document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');

    // Hide all dynamic sections
    document.querySelectorAll('.hidden').forEach(section => section.classList.add('hidden'));

    // Reset start and stop times
    startTime = null;
    stopTime = null;
    duration = null;

    // Reset button states
    document.querySelectorAll('button').forEach(button => {
        button.style.backgroundColor = '';
    });

    saveFormState();
}

// Function to toggle hallway clear buttons and display additional options if 'Not Clear' is selected
function toggleClear(status, sectionId) {
    const clearBtn = document.getElementById(`clearBtn${sectionId}`);
    const notClearBtn = document.getElementById(`notClearBtn${sectionId}`);
    const hallwayPeopleInput = document.getElementById(`hallwayPeopleInput${sectionId}`);
    const quietBtn = document.getElementById(`quietBtn${sectionId}`);
    const noisyBtn = document.getElementById(`noisyBtn${sectionId}`);
    const noiseLevelInput = document.getElementById(`noiseLevelInput${sectionId}`);

    if (status === 'clear') {
        clearBtn.style.backgroundColor = 'green';
        notClearBtn.style.backgroundColor = '';
        hallwayPeopleInput.classList.add('hidden');
        quietBtn.classList.remove('hidden');
        noisyBtn.classList.add('hidden');
        noisyBtn.style.backgroundColor = '';
        noiseLevelInput.classList.add('hidden');
    } else {
        notClearBtn.style.backgroundColor = 'green';
        clearBtn.style.backgroundColor = '';
        hallwayPeopleInput.classList.remove('hidden');
        quietBtn.classList.add('hidden');
        noisyBtn.classList.remove('hidden');
        noisyBtn.style.backgroundColor = 'green';
        noiseLevelInput.classList.remove('hidden');
    }

    saveFormState();
}

// Function to toggle noise buttons and display noise level options
function toggleNoise(status, sectionId) {
    const noiseLevelInput = document.getElementById(`noiseLevelInput${sectionId}`);
    const noiseComplaintForm = document.getElementById(`noiseComplaintForm${sectionId}`);

    if (status === 'quiet') {
        document.getElementById(`quietBtn${sectionId}`).style.backgroundColor = 'green';
        document.getElementById(`noisyBtn${sectionId}`).style.backgroundColor = '';
        document.getElementById(`noiseComplaintBtn${sectionId}`).style.backgroundColor = '';
        noiseLevelInput.classList.add('hidden');
        noiseComplaintForm.classList.add('hidden');
    } else if (status === 'noisy') {
        document.getElementById(`noisyBtn${sectionId}`).style.backgroundColor = 'green';
        document.getElementById(`quietBtn${sectionId}`).style.backgroundColor = '';
        document.getElementById(`noiseComplaintBtn${sectionId}`).style.backgroundColor = '';
        noiseLevelInput.classList.remove('hidden');
        noiseComplaintForm.classList.add('hidden');
    } else if (status === 'noiseComplaint') {
        document.getElementById(`noiseComplaintBtn${sectionId}`).style.backgroundColor = 'green';
        document.getElementById(`quietBtn${sectionId}`).style.backgroundColor = '';
        document.getElementById(`noisyBtn${sectionId}`).style.backgroundColor = '';
        noiseComplaintForm.classList.remove('hidden');
        noiseLevelInput.classList.add('hidden');
    }

    saveFormState();
}

// Function to show common room options if the number of people is greater than 0
function showCommonRoomOptions(sectionId) {
    const commonRoomPeople = document.getElementById(`commonRoomPeople${sectionId}`);
    const commonRoomOptions = document.getElementById(`commonRoomOptions${sectionId}`);
    if (commonRoomPeople && commonRoomPeople.value > 0) {
        commonRoomOptions.classList.remove('hidden');
    } else {
        commonRoomOptions.classList.add('hidden');
    }

    saveFormState();
}

// Function to show ravine room options if the number of people is greater than 0
function toggleRavineRoomOptions() {
    const people = document.getElementById('ravineRoomPeople');
    const options = document.getElementById('ravineRoomOptions');
    if (people && people.value > 0) {
        options.classList.remove('hidden');
    } else {
        options.classList.add('hidden');
    }

    saveFormState();
}

// Function to toggle visibility of Games Room options based on number of people input
function toggleGamesRoomOptions() {
    const peopleCount = document.getElementById('gamesRoomPeople').value;
    const optionsDiv = document.getElementById('gamesRoomOptions');
    optionsDiv.classList.toggle('hidden', peopleCount == 0);
}

// Function to toggle study room options based on locked/unlocked status
function toggleStudyRoom(status, roomId) {
    const studyRoomPeopleInput = document.getElementById(`studyRoom${roomId}PeopleInput`);
    if (status === 'locked') {
        document.getElementById(`lockedBtn${roomId}`).style.backgroundColor = 'green';
        document.getElementById(`unlockedBtn${roomId}`).style.backgroundColor = '';
        studyRoomPeopleInput.classList.add('hidden');
    } else {
        document.getElementById(`unlockedBtn${roomId}`).style.backgroundColor = 'green';
        document.getElementById(`lockedBtn${roomId}`).style.backgroundColor = '';
        studyRoomPeopleInput.classList.remove('hidden');
    }

    saveFormState();
}

// Function to show kitchen options if the number of people is greater than 0
function toggleKitchenOptions() {
    const people = document.getElementById('kitchenPeople');
    const options = document.getElementById('kitchenOptions');
    if (people && people.value > 0) {
        options.classList.remove('hidden');
    } else {
        options.classList.add('hidden');
    }

    saveFormState();
}

// Function to show kitchenette options if the number of people is greater than 0
function toggleKitchenetteOptions() {
    const people = document.getElementById('kitchenettePeople');
    const options = document.getElementById('kitchenetteOptions');
    if (people && people.value > 0) {
        options.classList.remove('hidden');
    } else {
        options.classList.add('hidden');
    }

    saveFormState();
}

// Function to copy the report to clipboard
function copyReport() {
    const report = generateReport();
    const textarea = document.createElement('textarea');
    textarea.value = report;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('Report copied to clipboard!');
    } catch (err) {
        alert('Failed to copy report: ', err);
    }
    document.body.removeChild(textarea);
}

// Function to generate the report
function generateReport() {
    const formattedStartTime = formatTime(startTime);
    const formattedStopTime = formatTime(stopTime);
    const formattedDate = formatDate(startTime);
    const formattedStopDate = formatDate(stopTime);
    const formattedDuration = formatDuration(duration);

    let report = `Hedwards Sweeps Report\n\nStart Time: ${formattedStartTime} on ${formattedDate}\nEnd Time: ${formattedStopTime} on ${formattedStopDate}\nDuration: ${formattedDuration}\n\n`;

    // Generate report for Hedden Hall
    report += generateHeddenReport();

    // Add a space between buildings
    report += `\n`;

    // Generate report for Edwards Hall
    report += generateEdwardsReport();

    return report;
}

// Function to generate the report for Hedden Hall
function generateHeddenReport() {
    let report = `Hedden Hall:\n\n`;
    const floors = ['5th', '4th', '3rd', '2nd', '1st'];
    const basement = 'Basement';

    floors.forEach(floor => {
        report += generateFloorReport('Hedden', floor, 'North');
        report += `\n`; // Add space between wings
        report += generateFloorReport('Hedden', floor, 'South');
        report += `\n`; // Add space between floors
    });

    report += generateBasementReport('Hedden', basement);
    report += `\n`; // Add space after basements

    return report;
}

// Function to generate the report for Edwards Hall
function generateEdwardsReport() {
    let report = `Edwards Hall:\n\n`;
    const floors = ['3rd', '2nd', '1st'];
    const basement = 'Basement';

    floors.forEach(floor => {
        report += generateEdwardsFloorReport('Edwards', floor);
        report += `\n`; // Add space between floors
    });

    report += generateBasementReport('Edwards', basement);
    report += `\n`; // Add space after basements

    return report;
}

// Function to generate the floor report for each floor in Hedden Hall
function generateFloorReport(building, floor, wing) {
    let sectionId = `${floor}${wing}${building}`;
    let report = `${building}: ${floor} Floor ${wing} Wing:\n`;

    // Hallway status
    const clearHallway = document.getElementById(`clearBtn${sectionId}`);
    const notClearHallway = document.getElementById(`notClearBtn${sectionId}`);
    const peopleInHallInput = document.getElementById(`hallwayPeople${sectionId}`);
    const peopleInHall = peopleInHallInput ? peopleInHallInput.value : '0';

    // Noise status
    const quietBtn = document.getElementById(`quietBtn${sectionId}`);
    const noisyBtn = document.getElementById(`noisyBtn${sectionId}`);
    const noiseLevelInput = document.getElementById(`noiseLevel${sectionId}`);
    const noiseComplaintBtn = document.getElementById(`noiseComplaintBtn${sectionId}`);
    const noiseComplaintRoomInput = document.getElementById(`complaintRoomNumber${sectionId}`);
    const noiseComplaintCommentInput = document.getElementById(`complaintComments${sectionId}`);

    const quiet = quietBtn && quietBtn.style.backgroundColor === 'green';
    const noisy = noisyBtn && noisyBtn.style.backgroundColor === 'green';
    const noiseLevel = noiseLevelInput ? noiseLevelInput.value : '0';
    const noiseComplaint = noiseComplaintBtn && noiseComplaintBtn.style.backgroundColor === 'green';
    const noiseComplaintRoom = noiseComplaintRoomInput ? noiseComplaintRoomInput.value : '';
    const noiseComplaintComment = noiseComplaintCommentInput ? noiseComplaintCommentInput.value : '';

    // Common Room status
    const commonRoomPeopleInput = document.getElementById(`commonRoomPeople${sectionId}`);
    const peopleInCommonRoom = commonRoomPeopleInput ? commonRoomPeopleInput.value : '0';
    let activities = [];
    document.querySelectorAll(`#commonRoomOptions${sectionId} input[type="checkbox"]:checked`).forEach(checkbox => {
        activities.push(checkbox.value);
    });

    // Additional Comments
    const additionalCommentsInput = document.getElementById(`comments${sectionId}`);
    const additionalComments = additionalCommentsInput ? additionalCommentsInput.value : '';

    // Automatically set to "Clear and Quiet" with 0 people in common room if nothing is selected
    const isClearSelected = clearHallway && clearHallway.style.backgroundColor === 'green';
    const isQuietSelected = quietBtn && quietBtn.style.backgroundColor === 'green';
    const isCommonRoomDefault = peopleInCommonRoom === '0' && activities.length === 0;

    if (isClearSelected || isQuietSelected || !isCommonRoomDefault) {
        if (isClearSelected && isQuietSelected) {
            report += `Clear and Quiet\n`;
        } else {
            report += `Hallways: ${isClearSelected ? 'Clear' : `${peopleInHall} people in hall`}\n`;
            report += `Noise: ${isQuietSelected ? 'Quiet' : noisy ? `${noiseLevel}/10 Noise level (10 is very loud)` : noiseComplaint ? `Noise complaint reported for Room ${noiseComplaintRoom}` : 'Quiet'}\n`;
            if (noiseComplaint && noiseComplaintComment) {
                report += `Noise Complaint Comment: ${noiseComplaintComment}\n`;
            }
        }

        if (!isCommonRoomDefault) {
            report += `Common Room: ${peopleInCommonRoom} people in room (${activities.join(', ')})\n`;
        }
    } else {
        report += `Clear and Quiet\n`;
        report += `Common Room: 0 people in room\n`;
    }

    // Add additional comments if present
    if (additionalComments) {
        report += `Additional Comments: ${additionalComments}\n`;
    }

    report += `\n`; // Add space after each wing
    return report;
}

// Function to generate the floor report for each floor in Edwards Hall
function generateEdwardsFloorReport(building, floor) {
    let sectionId = `${floor}${building}`;
    let report = `${building}: ${floor} Floor:\n`;

    // Hallway status
    const clearHallway = document.getElementById(`clearBtn${sectionId}`);
    const notClearHallway = document.getElementById(`notClearBtn${sectionId}`);
    const peopleInHallInput = document.getElementById(`hallwayPeople${sectionId}`);
    const peopleInHall = peopleInHallInput ? peopleInHallInput.value : '0';

    // Noise status
    const quietBtn = document.getElementById(`quietBtn${sectionId}`);
    const noisyBtn = document.getElementById(`noisyBtn${sectionId}`);
    const noiseLevelInput = document.getElementById(`noiseLevel${sectionId}`);
    const noiseComplaintBtn = document.getElementById(`noiseComplaintBtn${sectionId}`);
    const noiseComplaintRoomInput = document.getElementById(`complaintRoomNumber${sectionId}`);
    const noiseComplaintCommentInput = document.getElementById(`complaintComments${sectionId}`);

    const quiet = quietBtn && quietBtn.style.backgroundColor === 'green';
    const noisy = noisyBtn && noisyBtn.style.backgroundColor === 'green';
    const noiseLevel = noiseLevelInput ? noiseLevelInput.value : '0';
    const noiseComplaint = noiseComplaintBtn && noiseComplaintBtn.style.backgroundColor === 'green';
    const noiseComplaintRoom = noiseComplaintRoomInput ? noiseComplaintRoomInput.value : '';
    const noiseComplaintComment = noiseComplaintCommentInput ? noiseComplaintCommentInput.value : '';

    // Common Room status
    const commonRoomPeopleInput = document.getElementById(`commonRoomPeople${sectionId}`);
    const peopleInCommonRoom = commonRoomPeopleInput ? commonRoomPeopleInput.value : '0';
    let activities = [];
    document.querySelectorAll(`#commonRoomOptions${sectionId} input[type="checkbox"]:checked`).forEach(checkbox => {
        activities.push(checkbox.value);
    });

    // Additional Comments
    const additionalCommentsInput = document.getElementById(`comments${sectionId}`);
    const additionalComments = additionalCommentsInput ? additionalCommentsInput.value : '';

    // Automatically set to "Clear and Quiet" with 0 people in common room if nothing is selected
    const isClearSelected = clearHallway && clearHallway.style.backgroundColor === 'green';
    const isQuietSelected = quietBtn && quietBtn.style.backgroundColor === 'green';
    const isCommonRoomDefault = peopleInCommonRoom === '0' && activities.length === 0;

    if (isClearSelected || isQuietSelected || !isCommonRoomDefault) {
        if (isClearSelected && isQuietSelected) {
            report += `Clear and Quiet\n`;
        } else {
            report += `Hallways: ${isClearSelected ? 'Clear' : `${peopleInHall} people in hall`}\n`;
            report += `Noise: ${isQuietSelected ? 'Quiet' : noisy ? `${noiseLevel}/10 Noise level (10 is very loud)` : noiseComplaint ? `Noise complaint reported for Room ${noiseComplaintRoom}` : 'Quiet'}\n`;
            if (noiseComplaint && noiseComplaintComment) {
                report += `Noise Complaint Comment: ${noiseComplaintComment}\n`;
            }
        }

        if (!isCommonRoomDefault) {
            report += `Common Room: ${peopleInCommonRoom} people in room (${activities.join(', ')})\n`;
        }
    } else {
        report += `Clear and Quiet\n`;
        report += `Common Room: 0 people in room\n`;
    }

    // Add additional comments if present
    if (additionalComments) {
        report += `Additional Comments: ${additionalComments}\n`;
    }

    report += `\n`; // Add space after each floor
    return report;
}

// Function to generate the basement report for each building
function generateBasementReport(building, basement) {
    let report = `${building} ${basement}:\n`;

    if (building === 'Hedden') {
        // Ravine Room options similar to a games room
        let ravineRoomPeople = '0';
        let ravineActivities = [];
        let studyRoomB111Status = 'Unlocked, 0 people in room';
        let studyRoomB112Status = 'Unlocked, 0 people in room';
        let laundryRoomPeople = '0';
        let femaleWashroomPeople = '0';
        let maleWashroomPeople = '0';

        // Check if any inputs are filled; otherwise, assume defaults
        const ravineRoomPeopleInput = document.getElementById('ravineRoomPeople');
        if (ravineRoomPeopleInput && ravineRoomPeopleInput.value > 0) {
            ravineRoomPeople = ravineRoomPeopleInput.value;
            document.querySelectorAll('#ravineRoomOptions input[type="checkbox"]:checked').forEach(checkbox => {
                ravineActivities.push(checkbox.value);
            });
        }

        const studyRoomB111Locked = document.getElementById('lockedBtnB111');
        const studyRoomB111PeopleInput = document.getElementById('studyRoomB111People');
        if (studyRoomB111Locked && studyRoomB111Locked.style.backgroundColor !== 'green' && studyRoomB111PeopleInput) {
            studyRoomB111Status = `Unlocked, ${studyRoomB111PeopleInput.value} people in room`;
        }

        const studyRoomB112Locked = document.getElementById('lockedBtnB112');
        const studyRoomB112PeopleInput = document.getElementById('studyRoomB112People');
        if (studyRoomB112Locked && studyRoomB112Locked.style.backgroundColor !== 'green' && studyRoomB112PeopleInput) {
            studyRoomB112Status = `Unlocked, ${studyRoomB112PeopleInput.value} people in room`;
        }

        const laundryRoomPeopleInput = document.getElementById('laundryRoomPeople');
        if (laundryRoomPeopleInput) laundryRoomPeople = laundryRoomPeopleInput.value;

        const femaleWashroomPeopleInput = document.getElementById('femaleWashroomPeople');
        if (femaleWashroomPeopleInput) femaleWashroomPeople = femaleWashroomPeopleInput.value;

        const maleWashroomPeopleInput = document.getElementById('maleWashroomPeople');
        if (maleWashroomPeopleInput) maleWashroomPeople = maleWashroomPeopleInput.value;

        report += `Ravine Room: ${ravineRoomPeople} people in room (${ravineActivities.join(', ')})\n`;
        report += `Study Room B111: ${studyRoomB111Status}\n`;
        report += `Study Room B112: ${studyRoomB112Status}\n`;
        report += `Laundry Room: ${laundryRoomPeople} people in room\n`;
        report += `Washrooms: ${femaleWashroomPeople} in Female, ${maleWashroomPeople} in Male\n`;
    }

    if (building === 'Edwards') {
        // Games Room with options similar to Ravine Room
        let gamesRoomPeople = '0';
        let gamesActivities = [];
        let studyRoomB105Status = 'Unlocked, 0 people in room';
        let studyRoomB106Status = 'Unlocked, 0 people in room';
        let studyRoomB102Status = 'Unlocked, 0 people in room';
        let laundryRoomPeople = '0';
        let kitchenPeople = '0';
        let kitchenActivities = [];
        let kitchenettePeople = '0';
        let kitchenetteActivities = [];

        // Check if any inputs are filled; otherwise, assume defaults
        const gamesRoomPeopleInput = document.getElementById('gamesRoomPeople');
        if (gamesRoomPeopleInput && gamesRoomPeopleInput.value > 0) {
            gamesRoomPeople = gamesRoomPeopleInput.value;
            document.querySelectorAll('#gamesRoomOptions input[type="checkbox"]:checked').forEach(checkbox => {
                gamesActivities.push(checkbox.value);
            });
        }

        const studyRoomB105Locked = document.getElementById('lockedBtnB105');
        const studyRoomB105PeopleInput = document.getElementById('studyRoomB105People');
        if (studyRoomB105Locked && studyRoomB105Locked.style.backgroundColor !== 'green' && studyRoomB105PeopleInput) {
            studyRoomB105Status = `Unlocked, ${studyRoomB105PeopleInput.value} people in room`;
        }

        const studyRoomB106Locked = document.getElementById('lockedBtnB106');
        const studyRoomB106PeopleInput = document.getElementById('studyRoomB106People');
        if (studyRoomB106Locked && studyRoomB106Locked.style.backgroundColor !== 'green' && studyRoomB106PeopleInput) {
            studyRoomB106Status = `Unlocked, ${studyRoomB106PeopleInput.value} people in room`;
        }

        const studyRoomB102Locked = document.getElementById('lockedBtnB102');
        const studyRoomB102PeopleInput = document.getElementById('studyRoomB102People');
        if (studyRoomB102Locked && studyRoomB102Locked.style.backgroundColor !== 'green' && studyRoomB102PeopleInput) {
            studyRoomB102Status = `Unlocked, ${studyRoomB102PeopleInput.value} people in room`;
        }

        const laundryRoomPeopleInput = document.getElementById('laundryRoomPeopleEdwards');
        if (laundryRoomPeopleInput) laundryRoomPeople = laundryRoomPeopleInput.value;

        const kitchenPeopleInput = document.getElementById('kitchenPeople');
        if (kitchenPeopleInput && kitchenPeopleInput.value > 0) {
            kitchenPeople = kitchenPeopleInput.value;
            document.querySelectorAll('#kitchenOptions input[type="checkbox"]:checked').forEach(checkbox => {
                kitchenActivities.push(checkbox.value);
            });
        }

        const kitchenettePeopleInput = document.getElementById('kitchenettePeople');
        if (kitchenettePeopleInput && kitchenettePeopleInput.value > 0) {
            kitchenettePeople = kitchenettePeopleInput.value;
            document.querySelectorAll('#kitchenetteOptions input[type="checkbox"]:checked').forEach(checkbox => {
                kitchenetteActivities.push(checkbox.value);
            });
        }

        report += `Games Room: ${gamesRoomPeople} people in room (${gamesActivities.join(', ')})\n`;
        report += `Study Room B105: ${studyRoomB105Status}\n`;
        report += `Study Room B106: ${studyRoomB106Status}\n`;
        report += `Study Room B102: ${studyRoomB102Status}\n`;
        report += `Laundry Room: ${laundryRoomPeople} people in room\n`;
        report += `Kitchen: ${kitchenPeople} people in room (${kitchenActivities.join(', ')})\n`;
        report += `Kitchenette: ${kitchenettePeople} people in room (${kitchenetteActivities.join(', ')})\n`;
    }

    report += `\n`; // Add space after basement section
    return report;
}

// Function to save form state in local storage
function saveFormState() {
    const formData = new FormData(document.querySelector('form'));
    for (let [key, value] of formData.entries()) {
        localStorage.setItem(key, value);
    }

    // Save the start and stop time as well
    if (startTime) localStorage.setItem('startTime', startTime.toISOString());
    if (stopTime) localStorage.setItem('stopTime', stopTime.toISOString());
    if (duration) localStorage.setItem('duration', duration);
}

// Function to load form state from local storage
function loadFormState() {
    const formElements = document.querySelectorAll('input, textarea');
    formElements.forEach(element => {
        const value = localStorage.getItem(element.id);
        if (value !== null) {
            element.value = value;
            if (element.type === 'checkbox') {
                element.checked = value === 'true';
            }
        }
    });

    // Load the start and stop time if they exist
    const storedStartTime = localStorage.getItem('startTime');
    const storedStopTime = localStorage.getItem('stopTime');
    const storedDuration = localStorage.getItem('duration');
    if (storedStartTime) startTime = new Date(storedStartTime);
    if (storedStopTime) stopTime = new Date(storedStopTime);
    if (storedDuration) duration = parseInt(storedDuration);

    // If there is a stored start time, show the footer and stop button
    if (startTime) {
        document.getElementById('footerSection').classList.remove('hidden');
        document.getElementById('stopSweepBtn').classList.remove('hidden');
        document.getElementById('startSweepBtn').style.backgroundColor = 'green';
    }

    // If there is a stored stop time, hide the stop button and show the copy button
    if (stopTime) {
        document.getElementById('stopSweepBtn').classList.add('hidden');
        document.getElementById('copyReportBtn').classList.remove('hidden');
    }
}

// Save form state on change
document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('change', saveFormState);
});

// Load form state on page load
window.onload = loadFormState;