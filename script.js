// Global variables to store start time, stop time, and sweep duration
let startTime;
let stopTime;
let duration;

document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const offsetPadding = 20; // Additional padding to ensure content is fully in view
    
    // Function to check if the element's bottom is fully visible
    function isBottomFullyVisible(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if the element's bottom is fully visible in the viewport
        return rect.bottom <= viewportHeight;
    }
    
    // Function to scroll to a specific floor
    function scrollToFloor(floorId) {
        const floorElement = document.getElementById(floorId);

        if (floorElement) {
            const elementTop = floorElement.getBoundingClientRect().top + window.pageYOffset;
            const elementBottom = elementTop + floorElement.offsetHeight;
            const containerScrollPosition = mainContainer.scrollTop + mainContainer.offsetTop;
            const containerHeight = mainContainer.offsetHeight;

            // Check if the bottom of the floor section is fully visible
            if (!isBottomFullyVisible(floorElement)) {
                // If not, scroll to ensure the bottom is fully visible
                mainContainer.scrollTo({
                    top: elementTop - mainContainer.offsetTop - offsetPadding,
                    behavior: 'smooth' // Smooth scroll to make sure it's visible
                });
            }
        } else {
            console.error(`Element with ID ${floorId} not found`);
        }
    }

    // Expose the scrollToFloor function to the global scope for use in the HTML
    window.scrollToFloor = scrollToFloor;

    // Make sure buttons are clickable and properly set
    const sidebarButtons = document.querySelectorAll('.sidebar button');

    sidebarButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetFloorId = event.target.getAttribute('data-floor-id');
            scrollToFloor(targetFloorId);
        });
    });
});

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
    
    // Hide the overlay and display footer
    document.getElementById('overlay').style.display = 'none';
    
    // Show the stop button and hide the copy button
    document.getElementById('stopSweepBtn').style.display = 'inline-block';
    document.getElementById('copyReportBtn').style.display = 'none'; // Hide the copy button initially

    // Add additional logic to start the sweep here
}

// Function to stop the sweep
function stopSweep() {
    stopTime = new Date();
    duration = Math.floor((stopTime - startTime) / 1000); // Duration in seconds
    
    // Hide the stop button after clicking
    document.getElementById('stopSweepBtn').style.display = 'none';
    
    // Show the copy report button after stopping the sweep
    const copyReportBtn = document.getElementById('copyReportBtn');
    copyReportBtn.style.display = 'inline-block'; // Ensure the copy button is visible
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

// Function to generate the report for Hedden Hall with updated structure
function generateHeddenReport() {
    let report = `Hedden Hall:\n\n`;
    const floors = ['5th', '4th', '3rd', '2nd', '1st'];
    const basement = 'Basement';

    // Generate a report for each floor without wings
    floors.forEach(floor => {
        report += generateUpdatedFloorReport('Hedden', floor);
        report += `\n`; // Add space between floors
    });

    report += generateBasementReport('Hedden', basement);
    report += `\n`; // Add space after basements

    return report;
}

// Function to generate the updated floor report for Hedden Hall
function generateUpdatedFloorReport(building, floor) {
    let sectionId = `${floor}Hedden`;
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

    const isClear = clearHallway && clearHallway.style.backgroundColor === 'green';
    const isNotClear = notClearHallway && notClearHallway.style.backgroundColor === 'green';
    const isQuiet = quietBtn && quietBtn.style.backgroundColor === 'green';
    const isNoisy = noisyBtn && noisyBtn.style.backgroundColor === 'green';
    const noiseLevel = noiseLevelInput ? noiseLevelInput.value : '0';
    const isNoiseComplaint = noiseComplaintBtn && noiseComplaintBtn.style.backgroundColor === 'green';
    const noiseComplaintRoom = noiseComplaintRoomInput ? noiseComplaintRoomInput.value : '';
    const noiseComplaintComment = noiseComplaintCommentInput ? noiseComplaintCommentInput.value : '';

    // Common Room status
    const northCommonRoomPeopleInput = document.getElementById(`commonRoomPeople${floor}NorthHedden`);
    const southCommonRoomPeopleInput = document.getElementById(`commonRoomPeople${floor}SouthHedden`);
    const peopleInNorthCommonRoom = northCommonRoomPeopleInput ? northCommonRoomPeopleInput.value : '0';
    const peopleInSouthCommonRoom = southCommonRoomPeopleInput ? southCommonRoomPeopleInput.value : '0';

    let northActivities = [];
    let southActivities = [];

    document.querySelectorAll(`#commonRoomOptions${floor}NorthHedden input[type="checkbox"]:checked`).forEach(checkbox => {
        northActivities.push(checkbox.value);
    });

    document.querySelectorAll(`#commonRoomOptions${floor}SouthHedden input[type="checkbox"]:checked`).forEach(checkbox => {
        southActivities.push(checkbox.value);
    });

    // Additional Comments
    const additionalCommentsInput = document.getElementById(`comments${sectionId}`);
    const additionalComments = additionalCommentsInput ? additionalCommentsInput.value : '';

    // Construct the report logic
    if ((isClear && isQuiet) || (!isClear && !isNotClear && !isNoisy && !isNoiseComplaint)) {
        report += 'Clear and Quiet\n';
    } else {
        if (isClear) {
            report += 'Hallways: Clear\n';
        } else if (isNotClear) {
            report += `Hallways: ${peopleInHall} people\n`;
        }

        if (isNoisy) {
            report += `Noise level: ${noiseLevel}/10\n`;
        } else if (isNoiseComplaint) {
            report += `Noise complaint reported for Room ${noiseComplaintRoom}\n`;
            if (noiseComplaintComment) {
                report += `Noise Complaint Comment: ${noiseComplaintComment}\n`;
            }
        } else if (!isQuiet) {
            report += 'Noise level: Quiet\n';
        }
    }

    // Construct the report for the common rooms
    if (peopleInNorthCommonRoom > 0 || northActivities.length > 0) {
        report += `North Common Room: ${peopleInNorthCommonRoom} people in room ${northActivities.join(', ')}\n`;
    }

    if (peopleInSouthCommonRoom > 0 || southActivities.length > 0) {
        report += `South Common Room: ${peopleInSouthCommonRoom} people in room ${southActivities.join(', ')}\n`;
    }

    // Add additional comments if present
    if (additionalComments) {
        report += `Additional Comments: ${additionalComments}\n`;
    }

    report += `\n`; // Add space after each floor
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

    const isClear = clearHallway && clearHallway.style.backgroundColor === 'green';
    const isNotClear = notClearHallway && notClearHallway.style.backgroundColor === 'green';
    const isQuiet = quietBtn && quietBtn.style.backgroundColor === 'green';
    const isNoisy = noisyBtn && noisyBtn.style.backgroundColor === 'green';
    const noiseLevel = noiseLevelInput ? noiseLevelInput.value : '0';
    const isNoiseComplaint = noiseComplaintBtn && noiseComplaintBtn.style.backgroundColor === 'green';
    const noiseComplaintRoom = noiseComplaintRoomInput ? noiseComplaintRoomInput.value : '';
    const noiseComplaintComment = noiseComplaintCommentInput ? noiseComplaintCommentInput.value : '';

    // Common Room/Kitchen status based on the floor
    let kitchenPeopleInput, peopleInKitchen = '0', kitchenActivities = [];
    let commonRoom108PeopleInput, peopleInCommonRoom108 = '0', commonRoom108Activities = [];
    let commonRoom115PeopleInput, peopleInCommonRoom115 = '0', commonRoom115Activities = [];

    if (floor === '2nd') {
        // Floor 2 specific handling for Kitchen 226
        kitchenPeopleInput = document.getElementById(`commonRoomPeople2ndNorthEdwards`);
        if (kitchenPeopleInput && kitchenPeopleInput.value > 0) {
            peopleInKitchen = kitchenPeopleInput.value;
            document.querySelectorAll(`#commonRoomOptions2ndNorthEdwards input[type="checkbox"]:checked`).forEach(checkbox => {
                kitchenActivities.push(checkbox.value);
            });
        }
        
    } else if (floor === '1st') {
        // Floor 1 specific handling for Common Room 108 and Common Room 115
        commonRoom108PeopleInput = document.getElementById(`commonRoomPeople1stNorthEdwards108`);
        if (commonRoom108PeopleInput && commonRoom108PeopleInput.value > 0) {
            peopleInCommonRoom108 = commonRoom108PeopleInput.value;
            document.querySelectorAll(`#commonRoomOptions1stNorthEdwards108 input[type="checkbox"]:checked`).forEach(checkbox => {
                commonRoom108Activities.push(checkbox.value);
            });
        }

        commonRoom115PeopleInput = document.getElementById(`commonRoomPeople1stNorthEdwards115`);
        if (commonRoom115PeopleInput && commonRoom115PeopleInput.value > 0) {
            peopleInCommonRoom115 = commonRoom115PeopleInput.value;
            document.querySelectorAll(`#commonRoomOptions1stNorthEdwards115 input[type="checkbox"]:checked`).forEach(checkbox => {
                commonRoom115Activities.push(checkbox.value);
            });
        }

    }

    // Additional Comments
    const additionalCommentsInput2 = document.getElementById(`comments2ndNorthEdwards`);
    const additionalComments2 = additionalCommentsInput2 ? additionalCommentsInput2.value.trim() : '';

    // Additional Comments
    const additionalCommentsInput1 = document.getElementById(`comments1stNorthEdwards`);
    const additionalComments1 = additionalCommentsInput1 ? additionalCommentsInput1.value.trim() : '';

    // Additional Comments
    const additionalCommentsInput3 = document.getElementById(`comments3rdNorthEdwards`);
    const additionalComments3 = additionalCommentsInput3 ? additionalCommentsInput3.value.trim() : '';


    // Construct the report logic
    if ((isClear && isQuiet) || (!isClear && !isNotClear && !isNoisy && !isNoiseComplaint)) {
        // If both are selected as "Clear" and "Quiet", or if no selections are made
        report += 'Clear and Quiet\n';
    } else {
        // If hallways are clear but noise is not quiet
        if (isClear) {
            report += 'Hallways: Clear\n';
        } else if (isNotClear) {
            report += `Hallways: ${peopleInHall} people\n`;
        }

        // Noise level or noise complaint details
        if (isNoisy) {
            report += `Noise level: ${noiseLevel}/10\n`;
        } else if (isNoiseComplaint) {
            report += `Noise complaint reported for Room ${noiseComplaintRoom}\n`;
            if (noiseComplaintComment) {
                report += `Noise Complaint Comment: ${noiseComplaintComment}\n`;
            }
        } else if (!isQuiet) {
            report += 'Noise level: Quiet\n';
        }
    }

    // Construct the report for specific rooms
    if (floor === '2nd') {
        if (peopleInKitchen > 0 || kitchenActivities.length > 0) {
            report += `Kitchen 226: ${peopleInKitchen} people in room ${kitchenActivities.join(', ')}\n`;
            // Include Additional Comments if present
            if (additionalComments2) {
                report += `Additional Comments: ${additionalComments2}\n`;
            }
        }
    } else if (floor === '1st') {
        if (peopleInCommonRoom108 > 0 || commonRoom108Activities.length > 0) {
            report += `Common Room 108: ${peopleInCommonRoom108} people in room ${commonRoom108Activities.join(', ')}\n`;
        }
        if (peopleInCommonRoom115 > 0 || commonRoom115Activities.length > 0) {
            report += `Common Room 115: ${peopleInCommonRoom115} people in room ${commonRoom115Activities.join(', ')}\n`;
        }
        if (additionalComments1) {
            report += `Additional Comments: ${additionalComments1}\n`;
        }
    } else if (floor === '3rd') {
        // Include Additional Comments if present
        if (additionalComments3) {
            report += `Additional Comments: ${additionalComments3}\n`;
        }
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

        // Additional Comments for Hedden Basement
        const additionalCommentsInput = document.getElementById('basementComments');
        const additionalComments = additionalCommentsInput ? additionalCommentsInput.value.trim() : '';

        report += `Ravine Room: ${ravineRoomPeople} people in room ${ravineActivities.join(', ')}\n`;
        report += `Study Room B111: ${studyRoomB111Status}\n`;
        report += `Study Room B112: ${studyRoomB112Status}\n`;
        report += `Laundry Room: ${laundryRoomPeople} people in room\n`;

        // Include Additional Comments if present
        if (additionalComments) {
            report += `Additional Comments: ${additionalComments}\n`;
        }
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
        
        // Additional Comments for Edwards Basement
        const additionalCommentsInputEdwards = document.getElementById('basementCommentsEdwards');
        const additionalCommentsEdwards = additionalCommentsInputEdwards ? additionalCommentsInputEdwards.value.trim() : '';

        report += `Games Room: ${gamesRoomPeople} people in room ${gamesActivities.join(', ')}\n`;
        report += `Study Room B105: ${studyRoomB105Status}\n`;
        report += `Study Room B106: ${studyRoomB106Status}\n`;
        report += `Study Room B102: ${studyRoomB102Status}\n`;
        report += `Laundry Room: ${laundryRoomPeople} people in room\n`;
        report += `Kitchen: ${kitchenPeople} people in room ${kitchenActivities.join(', ')}\n`;
        report += `Kitchenette: ${kitchenettePeople} people in room ${kitchenetteActivities.join(', ')}\n`;

        // Include Additional Comments if present for Edwards Basement
        if (additionalCommentsEdwards) {
            report += `Additional Comments: ${additionalCommentsEdwards}\n`;
        }
    }

    report += `\n`; // Add space after basement section
    return report;
}