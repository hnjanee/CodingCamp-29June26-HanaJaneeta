# Life Dashboard — Technical Design

## Overview
A single-page dashboard built with HTML, CSS, and Vanilla JavaScript. All state is managed in-memory and persisted to LocalStorage. No build tools, no frameworks, no dependencies.

---

## File Structure

```
index.html        — page structure and widget markup
css/style.css     — all visual styling
js/app.js         — all application logic
```

---

## Page Layout

The page is divided into a responsive grid of four widget cards:

```
┌─────────────────────┬─────────────────────┐
│   Greeting          │   Focus Timer        │
│   (time, date,      │   (countdown,        │
│    greeting)        │    controls)         │
├─────────────────────┼─────────────────────┤
│   To-Do List        │   Quick Links        │
│   (input + list)    │   (input + buttons)  │
└─────────────────────┴─────────────────────┘
```

On smaller screens (< 768px) the grid collapses to a single column.

---

## HTML Structure

```html
<body>
  <div class="dashboard">

    <!-- Widget 1: Greeting -->
    <section class="widget" id="greeting-widget">
      <div id="greeting-text"></div>
      <div id="clock"></div>
      <div id="date"></div>
    </section>

    <!-- Widget 2: Focus Timer -->
    <section class="widget" id="timer-widget">
      <h2>Focus Timer</h2>
      <div id="timer-display">25:00</div>
      <div class="timer-controls">
        <button id="timer-start">Start</button>
        <button id="timer-stop">Stop</button>
        <button id="timer-reset">Reset</button>
      </div>
    </section>

    <!-- Widget 3: To-Do List -->
    <section class="widget" id="todo-widget">
      <h2>To-Do List</h2>
      <div class="todo-input-row">
        <input type="text" id="todo-input" placeholder="Add a task..." />
        <button id="todo-add">Add</button>
      </div>
      <ul id="todo-list"></ul>
    </section>

    <!-- Widget 4: Quick Links -->
    <section class="widget" id="links-widget">
      <h2>Quick Links</h2>
      <div class="links-input-row">
        <input type="text" id="link-label" placeholder="Label" />
        <input type="text" id="link-url" placeholder="https://..." />
        <button id="link-add">Add</button>
      </div>
      <div id="links-list"></div>
    </section>

  </div>
</body>
```

---

## CSS Design

- **Font:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- **Color palette:**
  - Background: `#0f0f13` (dark)
  - Widget card: `#1a1a24`
  - Accent: `#7c6af7` (soft purple)
  - Text primary: `#f0f0f5`
  - Text muted: `#888899`
  - Done task: `#555566`
- **Layout:** CSS Grid, 2 columns on desktop, 1 column on mobile
- **Cards:** Rounded corners (`border-radius: 16px`), subtle box shadow
- **Buttons:** Accent color background, hover state with slight brightness shift
- **Timer display:** Large monospace font for the countdown

---

## JavaScript Modules (all in app.js)

### 1. Greeting Module
```
initGreeting()
  - Runs setInterval every 1000ms
  - Each tick:
      - Gets current Date
      - Formats time as HH:MM:SS
      - Formats date as "Weekday, Month Day, Year"
      - Determines greeting by hour:
          0-4   → "Good evening"
          5-11  → "Good morning"
          12-17 → "Good afternoon"
          18-23 → "Good evening"
      - Updates #clock, #date, #greeting-text DOM elements
```

### 2. Timer Module
```
State:
  timerInterval   — setInterval reference (null when stopped)
  timeLeft        — seconds remaining (default 1500 = 25 min)
  isRunning       — boolean

initTimer()
  - Renders initial display
  - Attaches click listeners to Start, Stop, Reset buttons

startTimer()
  - If already running, do nothing
  - Sets isRunning = true
  - setInterval every 1000ms:
      - Decrements timeLeft
      - Updates #timer-display
      - If timeLeft === 0: calls timerComplete()

stopTimer()
  - Clears interval
  - Sets isRunning = false

resetTimer()
  - Calls stopTimer()
  - Sets timeLeft = 1500
  - Updates #timer-display to "25:00"

timerComplete()
  - Calls stopTimer()
  - Alerts user ("Focus session complete! Take a break.")
  - Optionally flashes the timer display

formatTime(seconds)
  - Returns "MM:SS" string
```

### 3. To-Do Module
```
State:
  tasks — array of { id, text, done }  (loaded from LocalStorage on init)

LocalStorage key: "dashboard_tasks"

initTodo()
  - Loads tasks from LocalStorage
  - Renders all tasks
  - Attaches Add button and Enter keypress listener on input

addTask(text)
  - Validates input is not empty
  - Creates task object: { id: Date.now(), text, done: false }
  - Pushes to tasks array
  - Saves to LocalStorage
  - Re-renders list

toggleTask(id)
  - Finds task by id, flips done boolean
  - Saves to LocalStorage
  - Re-renders list

editTask(id, newText)
  - Finds task by id, updates text
  - Saves to LocalStorage
  - Re-renders list

deleteTask(id)
  - Filters task out of array
  - Saves to LocalStorage
  - Re-renders list

renderTodos()
  - Clears #todo-list
  - For each task, creates <li> with:
      - Checkbox or done-toggle button
      - Text span (editable on click)
      - Delete button
  - Done tasks get class "done" (strikethrough style)

saveTasks()
  - localStorage.setItem("dashboard_tasks", JSON.stringify(tasks))

loadTasks()
  - Returns JSON.parse(localStorage.getItem("dashboard_tasks")) || []
```

### 4. Quick Links Module
```
State:
  links — array of { id, label, url }  (loaded from LocalStorage on init)

LocalStorage key: "dashboard_links"

initLinks()
  - Loads links from LocalStorage
  - Renders all link buttons
  - Attaches Add button listener

addLink(label, url)
  - Validates both fields are non-empty
  - Ensures url starts with "http://" or "https://", prepends "https://" if missing
  - Creates link object: { id: Date.now(), label, url }
  - Pushes to links array
  - Saves to LocalStorage
  - Re-renders list

deleteLink(id)
  - Filters link out of array
  - Saves to LocalStorage
  - Re-renders list

renderLinks()
  - Clears #links-list
  - For each link, creates a <button> that opens url in new tab + a delete button

saveLinks()
  - localStorage.setItem("dashboard_links", JSON.stringify(links))

loadLinks()
  - Returns JSON.parse(localStorage.getItem("dashboard_links")) || []
```

### 5. App Entry Point
```
document.addEventListener("DOMContentLoaded", () => {
  initGreeting();
  initTimer();
  initTodo();
  initLinks();
});
```

---

## LocalStorage Schema

| Key                | Value shape                                      |
|--------------------|--------------------------------------------------|
| `dashboard_tasks`  | `[{ id: number, text: string, done: boolean }]`  |
| `dashboard_links`  | `[{ id: number, label: string, url: string }]`   |

---

## Error Handling

- Empty task input → silently ignored (no add)
- Empty link label or URL → silently ignored (no add)
- Missing protocol on URL → auto-prepend `https://`
- Corrupt LocalStorage data → fall back to empty array
