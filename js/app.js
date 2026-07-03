const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greeting');

function updateDashboard() {
    const now = new Date();
    const rawHours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hours = rawHours < 10 ? '0' + rawHours : rawHours;
    const mins = minutes < 10 ? '0' + minutes : minutes;
    const secs = seconds < 10 ? '0' + seconds : seconds;

    clockElement.textContent = `${hours}:${mins}:${secs}`;

    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);

    if (rawHours >= 5 && rawHours < 12) {
        greetingElement.textContent = 'Good Morning';
    } else if (rawHours >= 12 && rawHours < 18) {
        greetingElement.textContent = 'Good Afternoon';
    } else {
        greetingElement.textContent = 'Good Evening';
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

function updateTimerButtons() {
    const running = timerInterval !== null;
    startButton.disabled = running;
    stopButton.disabled = !running;
    startButton.style.opacity = running ? '0.5' : '1';
    stopButton.style.opacity = !running ? '0.5' : '1';
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
            timerDisplay.classList.add('timer-complete');
            updateTimerButtons();
            alert('Focus time is over! Take a short break. 🎉');
        }
    }, 1000);
    updateTimerButtons();
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    updateTimerButtons();
}

function resetTimer() {
    stopTimer();
    const chosenMinutes = parseInt(document.getElementById('custom-minutes').value) || 25;
    totalSeconds = chosenMinutes * 60;
    timerDisplay.classList.remove('timer-complete');
    displayTime();
}

document.getElementById('custom-minutes').addEventListener('change', resetTimer);
document.getElementById('custom-minutes').addEventListener('input', function () {
    stopTimer();
    const chosenMinutes = parseInt(this.value) || 0;
    totalSeconds = chosenMinutes * 60;
    displayTime();
});

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
updateTimerButtons();


const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('myDashboardTasks')) || [];
let editingIndex = null;

function renderTasks() {
    todoList.innerHTML = '';

    const counter = document.getElementById('task-counter');
    const doneCount = tasks.filter(t => t.completed).length;
    const total = tasks.length;

    if (total === 0) {
        counter.textContent = '';
        todoList.innerHTML = '<li class="todo-empty">Nothing to do — enjoy your day! ☀️</li>';
        localStorage.setItem('myDashboardTasks', JSON.stringify(tasks));
        return;
    }

    counter.textContent = `${doneCount}/${total} done`;
    counter.classList.toggle('all-done', doneCount === total && total > 0);

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (task.completed ? ' completed' : '');

        let taskDisplayElement;
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';

        if (index === editingIndex) {
            taskDisplayElement = document.createElement('input');
            taskDisplayElement.type = 'text';
            taskDisplayElement.className = 'edit-input';
            taskDisplayElement.value = task.text;

            editBtn.textContent = '💾';
            editBtn.onclick = function () {
                if (taskDisplayElement.value.trim() !== '') {
                    tasks[index].text = taskDisplayElement.value.trim();
                    editingIndex = null;
                    renderTasks();
                }
            };
        } else {
            taskDisplayElement = document.createElement('span');
            taskDisplayElement.className = 'task-text';
            taskDisplayElement.textContent = task.text;

            editBtn.textContent = '✏️';
            editBtn.onclick = function () {
                editingIndex = index;
                renderTasks();
            };
        }

        li.appendChild(taskDisplayElement);

        const btnContainer = document.createElement('div');
        btnContainer.className = 'todo-buttons';

        const doneBtn = document.createElement('button');
        doneBtn.className = 'done-btn';
        doneBtn.textContent = '✔';
        doneBtn.onclick = function () { toggleTask(index); };
        btnContainer.appendChild(doneBtn);

        btnContainer.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '❌';
        deleteBtn.onclick = function () { deleteTask(index); };
        btnContainer.appendChild(deleteBtn);

        li.appendChild(btnContainer);
        todoList.appendChild(li);
    });

    localStorage.setItem('myDashboardTasks', JSON.stringify(tasks));
}

todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText === '') {
        todoInput.classList.remove('shake');
        void todoInput.offsetWidth;
        todoInput.classList.add('shake');
        todoInput.addEventListener('animationend', () => todoInput.classList.remove('shake'), { once: true });
        return;
    }
    tasks.push({ text: taskText, completed: false });
    todoInput.value = '';
    renderTasks();
});

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    if (editingIndex === index) editingIndex = null;
    renderTasks();
}

renderTasks();


const linkForm = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const linksContainer = document.getElementById('links-container');

let quickLinks = JSON.parse(localStorage.getItem('myDashboardLinks')) || [
    { name: 'Google', url: 'https://google.com' },
    { name: 'Gmail', url: 'https://gmail.com' },
    { name: 'YouTube', url: 'https://youtube.com' }
];

function renderLinks() {
    linksContainer.innerHTML = '';

    if (quickLinks.length === 0) {
        linksContainer.innerHTML = '<p style="color: #64748b; font-size: 0.9rem; grid-column: span 2; text-align: center; margin-top: 1rem;">No links added yet!</p>';
    }

    quickLinks.forEach((link, index) => {
        const linkCard = document.createElement('div');
        linkCard.className = 'link-card';

        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = link.name;
        linkCard.appendChild(anchor);

        const deleteLinkBtn = document.createElement('button');
        deleteLinkBtn.className = 'delete-link-btn';
        deleteLinkBtn.textContent = '×';
        deleteLinkBtn.onclick = function () { deleteLink(index); };
        linkCard.appendChild(deleteLinkBtn);

        linksContainer.appendChild(linkCard);
    });

    localStorage.setItem('myDashboardLinks', JSON.stringify(quickLinks));
}

linkForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();

    if (name === '' || url === '') return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        linkUrlInput.classList.remove('shake');
        void linkUrlInput.offsetWidth;
        linkUrlInput.classList.add('shake');
        linkUrlInput.addEventListener('animationend', () => linkUrlInput.classList.remove('shake'), { once: true });
        linkUrlInput.placeholder = 'Must start with http:// or https://';
        setTimeout(() => { linkUrlInput.placeholder = 'URL'; }, 3000);
        return;
    }

    if (quickLinks.length >= 20) {
        alert('Maximum of 20 quick links reached. Delete one to add more.');
        return;
    }

    quickLinks.push({ name: name, url: url });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    renderLinks();
});

function deleteLink(index) {
    quickLinks.splice(index, 1);
    renderLinks();
}

renderLinks();


const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');
});

if (localStorage.getItem('dashboardTheme') === 'dark') {
    document.body.classList.add('dark-mode');
}


const nameSpan = document.getElementById('user-name');

if (nameSpan) {
    nameSpan.textContent = localStorage.getItem('dashboardUserPathName') || 'your name';

    nameSpan.addEventListener('blur', () => {
        if (nameSpan.textContent.trim() === '') {
            nameSpan.textContent = 'your name';
        }
        localStorage.setItem('dashboardUserPathName', nameSpan.textContent.trim());
    });

    nameSpan.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            nameSpan.blur();
        }
    });
}
