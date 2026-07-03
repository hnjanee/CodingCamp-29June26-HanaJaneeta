# Life Dashboard — Requirements

## Overview
A personal productivity dashboard that runs entirely in the browser. It shows a greeting, a focus timer, a to-do list, and quick links to favorite websites. All user data is stored in LocalStorage. No backend or framework is used.

---

## Requirements

### REQ-1: Greeting Widget
**User Story:** As a user, I want to see the current time, date, and a time-appropriate greeting so I feel welcomed when I open the dashboard.

**Acceptance Criteria:**
- AC-1.1: WHILE the dashboard is open, THE system SHALL display the current local time in HH:MM:SS (24-hour) format and update it once per second.
- AC-1.2: WHEN the page loads, THE system SHALL display the current local date in the format "Weekday, Month D, YYYY" (e.g., "Friday, July 3, 2026").
- AC-1.3: WHILE the dashboard is open, THE system SHALL update the displayed date when the local clock crosses midnight, so the date always reflects the current day without requiring a page reload.
- AC-1.4: WHILE the dashboard is open, THE system SHALL display a greeting based on the current local hour:
  - 05:00–11:59 → "Good Morning"
  - 12:00–17:59 → "Good Afternoon"
  - 18:00–23:59 → "Good Evening"
  - 00:00–04:59 → "Good Evening"
  And SHALL update the greeting automatically when the hour crosses a boundary.

---

### REQ-2: Focus Timer
**User Story:** As a user, I want a 25-minute countdown timer so I can use the Pomodoro technique to stay focused.

**Acceptance Criteria:**
- AC-2.1: WHEN the page loads, THE system SHALL display the timer at 25:00 in MM:SS format.
- AC-2.2: WHEN the user clicks Start and the timer is at its initial or reset state, THE system SHALL begin counting down from 25:00 at one-second intervals.
- AC-2.3: WHEN the user clicks Start and the timer is paused mid-session, THE system SHALL resume counting down from the paused value.
- AC-2.4: WHEN the user clicks Stop while the timer is running, THE system SHALL pause the countdown and retain the current remaining time.
- AC-2.5: WHEN the user clicks Reset, THE system SHALL stop the countdown and return the display to 25:00.
- AC-2.6: WHEN the timer reaches 00:00, THE system SHALL stop the countdown automatically, display a visual indicator (e.g., a highlighted or changed state on the timer display), and play an audible alert sound.
- AC-2.7: WHILE the timer is running, THE system SHALL disable the Start button; WHILE the timer is stopped or paused, THE system SHALL disable the Stop button.

---

### REQ-3: To-Do List
**User Story:** As a user, I want to manage a list of tasks so I can track what I need to do each day.

**Acceptance Criteria:**
- AC-3.1: WHEN the user types a non-empty task name and presses Enter or clicks the Add button, THE system SHALL append the task to the list and clear the input field.
- AC-3.2: IF the user attempts to add a task with an empty or whitespace-only input, THEN THE system SHALL NOT add the task and SHALL display an inline error or shake/highlight the input field.
- AC-3.3: WHEN a task is displayed, THE system SHALL show the task text along with Edit, Done/Undone toggle, and Delete action controls.
- AC-3.4: WHEN the user toggles a task as done, THE system SHALL apply a strikethrough visual style to the task text and mark it completed; WHEN toggled again, THE system SHALL remove the strikethrough and mark it incomplete.
- AC-3.5: WHEN the user clicks Edit on a task, THE system SHALL replace the task text with an editable input field pre-filled with the current text; WHEN the user confirms the edit (Enter or a Save button), THE system SHALL update the task text and return to display mode.
- AC-3.6: WHEN the user clicks Delete on a task, THE system SHALL remove that task from the list immediately.
- AC-3.7: WHEN any task is added, edited, toggled, or deleted, THE system SHALL synchronously update LocalStorage so the full task list (including done state) is persisted.
- AC-3.8: WHEN the page loads, THE system SHALL retrieve all tasks from LocalStorage and render them in their saved order with their correct done state.

---

### REQ-4: Quick Links
**User Story:** As a user, I want to save and access my favorite websites quickly from the dashboard.

**Acceptance Criteria:**
- AC-4.1: WHEN the user submits a new quick link entry with a label (1–50 characters) and a URL (1–2048 characters), THE system SHALL save the quick link and display it in the quick links list.
- AC-4.2: WHEN a quick link is displayed, THE system SHALL render it as a clickable button showing the label text that opens the associated URL in a new browser tab.
- AC-4.3: WHEN the user deletes a quick link, THE system SHALL remove it from the displayed list and update LocalStorage immediately to reflect the removal.
- AC-4.4: WHEN the page loads, THE system SHALL retrieve all quick links from LocalStorage and display them in the order they were originally saved, up to a maximum of 20 quick links.
- AC-4.5: IF the submitted URL does not begin with "http://" or "https://", THEN THE system SHALL reject the entry, not save it to LocalStorage, and display an error message indicating that the URL must include a valid protocol.

---

## Constraints
- HTML, CSS, Vanilla JavaScript only — no frameworks.
- All data stored in browser LocalStorage, client-side only.
- Must work in modern browsers: Chrome, Firefox, Edge, Safari.
- Clean, minimal interface with clear visual hierarchy and readable typography.
- Fast load time, no noticeable UI lag.
