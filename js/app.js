const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');

function updateDashboard() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;

    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);

    if (hours < 12) {
        greetingElement.textContent = "Good Morning!";
    } else if (hours < 18) {
        greetingElement.textContent = "Good Afternoon!";
    } else {
        greetingElement.textContent = "Good Evening!";
    }
}

setInterval(updateDashboard, 1000);
updateDashboard();


const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const resetButton = document.getElementById('reset-btn');

let totalSeconds = 25 * 60; 
let timerInterval = null;   

function displayTime() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;

    timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}


function startTimer() {

    if (timerInterval !== null) return;

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--; 
            displayTime();   
        } else {
           
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Focus time is over! Take a short break. 🎉");
        }
    }, 1000); 
}

function stopTimer() {
    clearInterval(timerInterval); 
    timerInterval = null;         
}


function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    
    // Read the user's custom minutes, fallback to 25 if it's empty
    const chosenMinutes = parseInt(document.getElementById('custom-minutes').value) || 25;
    
    // Set your totalSeconds dynamically instead of a hardcoded number!
    totalSeconds = chosenMinutes * 60; 
    
    updateDisplay(); // Make sure this matches your exact display function name
}

// Add this line right below the function so changing the input number updates the clock view instantly
document.getElementById('custom-minutes').addEventListener('change', resetTimer);

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// ==========================================
// PASTE THIS AT THE VERY BOTTOM OF APP.JS
// ==========================================
document.getElementById('custom-minutes').addEventListener('input', function() {
    // 1. Stop the active timer countdown so it doesn't glitch
    if (typeof timerId !== 'undefined') clearInterval(timerId);
    if (typeof countdown !== 'undefined') clearInterval(countdown);

    // 2. Read the number you just typed into the input field
    const chosenMinutes = parseInt(this.value) || 0;

    // 3. Update your master seconds variable 
    totalSeconds = chosenMinutes * 60;

    // 4. Force the screen to show the new time immediately
    if (typeof updateDisplay === 'function') updateDisplay();
    if (typeof renderTime === 'function') renderTime();
    if (typeof displayTime === 'function') displayTime();
});
// ==========================================
// FEATURE 3: TO-DO LIST (INLINE EDITING VERSION)
// ==========================================

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('myDashboardTasks')) || [];
let editingIndex = null; // New tracking variable: keeps track of which row is being edited

function renderTasks() {
    todoList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        
        if (task.completed) {
            li.style.textDecoration = 'line-through';
            li.style.opacity = '0.5';
        }

        // --- THE INLINE BRAIN ---
        // This variable will either hold normal text OR a live typing input box
        let taskDisplayElement; 
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';

        if (index === editingIndex) {
            // IF WE ARE EDITING THIS TASK: Swap text for a live input box
            taskDisplayElement = document.createElement('input');
            taskDisplayElement.type = 'text';
            taskDisplayElement.className = 'edit-input';
            taskDisplayElement.value = task.text;
            
            // Turn the pencil into a Save Disk
            editBtn.textContent = '💾'; 
            editBtn.onclick = function() {
                if (taskDisplayElement.value.trim() !== '') {
                    tasks[index].text = taskDisplayElement.value.trim();
                    editingIndex = null; // Close edit mode
                    renderTasks();       // Redraw screen
                }
            };
        } else {
            // REGULAR MODE: Just show normal text
            taskDisplayElement = document.createElement('span');
            taskDisplayElement.className = 'task-text';
            taskDisplayElement.textContent = task.text;

            // Keep it as a pencil icon
            editBtn.textContent = '✏️';
            editBtn.onclick = function() {
                editingIndex = index; // Turn on edit mode for this row!
                renderTasks();        // Redraw screen to show input box
            };
        }

        // Slap whichever element we built into the list row
        li.appendChild(taskDisplayElement);

        // --- BUTTONS CONTAINER ---
        const btnContainer = document.createElement('div');
        btnContainer.className = 'todo-buttons';

        // Checkmark Button
        const doneBtn = document.createElement('button');
        doneBtn.className = 'done-btn';
        doneBtn.textContent = '✔';
        doneBtn.onclick = function() { toggleTask(index); };
        btnContainer.appendChild(doneBtn);

        // Add the edit button we configured above
        btnContainer.appendChild(editBtn);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '❌';
        deleteBtn.onclick = function() { deleteTask(index); };
        btnContainer.appendChild(deleteBtn);

        li.appendChild(btnContainer);
        todoList.appendChild(li);
    });

    localStorage.setItem('myDashboardTasks', JSON.stringify(tasks));
}

// Action: Add a new task
todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText === '') return;

    tasks.push({ text: taskText, completed: false });
    todoInput.value = '';
    renderTasks();
});

// Action: Mark task as Done
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Action: Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    // If we delete the item we were currently editing, reset the edit tracker
    if (editingIndex === index) editingIndex = null; 
    renderTasks();
}

// Initial draw
renderTasks();

// ==========================================
// FEATURE 4: QUICK LINKS WIDGET WITH MEMORY
// ==========================================

// 1. Find our HTML elements for the links widget
const linkForm = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const linksContainer = document.getElementById('links-container');

// 2. Load saved links from the browser's brain (or start with empty array)
// Pre-populate with default values matching the image if memory is empty
let quickLinks = JSON.parse(localStorage.getItem('myDashboardLinks')) || [
    { name: 'Google', url: 'https://google.com' },
    { name: 'Gmail', url: 'https://gmail.com' },
    { name: 'Calendar', url: 'https://calendar.google.com' }
];

// 3. The Render Brain: Draws the bookmark buttons onto the screen
function renderLinks() {
    // Clear out the container first
    linksContainer.innerHTML = '';

    // If there are zero links, show a friendly helper message
    if (quickLinks.length === 0) {
        linksContainer.innerHTML = '<p style="color: #64748b; font-size: 0.9rem; grid-column: span 2; text-align: center; margin-top: 1rem;">No links added yet!</p>';
    }

    // Loop through our bookmarks and build the layout for each one
    quickLinks.forEach((link, index) => {
        const linkCard = document.createElement('div');
        linkCard.className = 'link-card';

        // Anchor tag for the actual clickable website link
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank'; // Opens the link in a brand new browser tab
        anchor.rel = 'noopener noreferrer'; // Security best practice for new tabs
        anchor.textContent = link.name;
        linkCard.appendChild(anchor);

        // Delete button to vaporize the link card
        const deleteLinkBtn = document.createElement('button');
        deleteLinkBtn.className = 'delete-link-btn';
        deleteLinkBtn.textContent = '×';
        deleteLinkBtn.onclick = function() { deleteLink(index); };
        linkCard.appendChild(deleteLinkBtn);

        // Append the finished link card into our grid layout container
        linksContainer.appendChild(linkCard);
    });

    // Save the array to local storage memory
    localStorage.setItem('myDashboardLinks', JSON.stringify(quickLinks));
}

// 4. Action: Add a new bookmark link
linkForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the page from refreshing

    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();

    if (name === '' || url === '') return;

    // Smart URL Fixer: If the user forgets to type "https://", add it automatically!
    // Otherwise, the browser will mistake it for a local folder path.
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // Add the new link object into our bucket array
    quickLinks.push({ name: name, url: url });

    // Empty out both text inputs so they are fresh for the next link
    linkNameInput.value = '';
    linkUrlInput.value = '';

    renderLinks(); // Refresh the screen
});

// 5. Action: Delete an old bookmark link
function deleteLink(index) {
    quickLinks.splice(index, 1); // Remove 1 item at this position
    renderLinks();              // Refresh the screen
}

// 6. Run immediately on start to display links saved from your last session
renderLinks();

// ==========================================
// FEATURE 5: PERSISTENT THEME TOGGLE ENGINE
// ==========================================
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    // Save preference to memory
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');
});

// Check for saved theme on initial startup
if (localStorage.getItem('dashboardTheme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// ==========================================
// FEATURE 6: INLINE CUSTOM NAME ENGINE
// ==========================================
const nameSpan = document.getElementById('user-name');

// Load saved name, or default to 'Stranger'
nameSpan.textContent = localStorage.getItem('dashboardUserPathName') || 'Stranger';

// When the user clicks away ('blur') or presses Enter, save the text!
nameSpan.addEventListener('blur', () => {
    if (nameSpan.textContent.trim() === '') {
        nameSpan.textContent = 'Stranger';
    }
    localStorage.setItem('dashboardUserPathName', nameSpan.textContent.trim());
});

nameSpan.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Stop creating a new text line
        nameSpan.blur();        // Triggers the save event above
    }
});