# Product Requirements Document (PRD)
## Commitment Progress Dashboard

---

## 1. Application Title
**Commitment Progress Dashboard** (An independent application decoupled from the Digima 10th Event Hub).

---

## 2. Introduction & Purpose
### 2.1 Background
In a previous company activity, all Digimers wrote down their personal commitments related to the **HEART** values (Harmony, Excellence, Accelerate Growth, Reliable, Teamwork) on a physical "Commitment Tree". To ensure these commitments transform from wall displays into actionable goals, an internal information system is required to track, measure, and document their tangible impact on daily operations over a 6-month period.

### 2.2 Purpose
To unite all Digimers under a collaborative vision, emphasizing that company growth is the direct result of the collective knowledge and energy pumped by every individual through a transparent and accountable public dashboard.

---

## 3. Requirements (MoSCoW Method)

### 3.1 Must Have (MVP)
* **Secure Gateway via PIN:** A minimalist login page using the unique 4-digit PIN data mirrored from the Event Hub database.
* **Transparent Main Dashboard:** Once authenticated, all internal users can view a public list of names, commitments, latest statuses, and measurable impacts of all Digimers.
* **Search & Filter Features:** Ability to search data using a *Search Bar* by Name and a *Dropdown Filter* strictly based on Status (`Not Started`, `In Progress`, `Achieved`).
* **Conditional Update Form:**
    * *Read-Only Fields:* Name and Initial Commitment fields are strictly read-only for standard users, **except** for users flagged as `NEW_USER`.
    * *Status Radio Buttons:* Selection choices among `Not Started`, `In Progress`, and `Achieved`.
    * *Conditional Logic:*
        * Selecting `Not Started` or `In Progress` dynamically displays the **Obstacles/Challenges Faced** field (saved to DB, hidden from the public main dashboard).
        * Selecting `Achieved` dynamically displays the **Measurable Impact** field with a general guidance placeholder.
* **Audit Trail & Logging System:** Continuous logging of all progress history entries from users (changes to status, challenges, or impacts), as well as a record of commitment revisions made by Admins.
* **Flagging Feature & Dynamic Hover Tooltips:**
    * Inadequate or unmeasurable commitments will display a `⚠️ Needs Review` icon on the dashboard.
    * When hovering over the `⚠️ Needs Review` icon, the tooltip text will dynamically render based on the `review_reason` column in the database:
        * **`NOT_MEASURABLE`**: *"Komitmen ini perlu disesuaikan agar dampaknya lebih terukur di pekerjaan."*
        * **`TOO_OPTIMISTIC`**: *"Komitmen ini perlu disesuaikan agar target komitmen ini optimis untuk dicapai dalam waktu 6 bulan."*
        * **`NEW_USER`**: *"Komitmen awal belum tercatat, masukkan komitmen yang ingin kamu capai dalam waktu 6 bulan."*
* **Modul Admin (Superuser):**
    * A dedicated Admin View equipped with a `"Needs Review"` filter to easily isolate and revise problematic commitment texts.
    * **Revision Notification:** Displaying a banner on the specific user's form if an admin alters their text: *"Your commitment has been updated by [Admin Name] on [Date/Time of Change]"*.

### 3.2 Should Have
* **Session Persistence:** Utilizing `localStorage` or React Context so users do not have to re-enter their PIN multiple times during an active browser session.
* **Export to Excel (Admin):** A button for Admins to download a full progress history report in `.xlsx` format for management review.

### 3.3 Could Have
* **Dashboard Summary Statistics:** A small pie chart or metric block at the top of the main dashboard showing the global percentage breakdown of statuses (`Not Started`, `In Progress`, `Achieved`).

### 3.4 Won't Have
* **Filtering by Team Name:** The main dashboard will not display team names and will not provide filters for divisions/teams.
* **Real-Time Live Event Integration:** This application will not stream data or connect directly to the main stage screens of the Event Hub during the anniversary event day.

---

## 4. User Flow

### 4.1 Standard User Flow (Digimers)
1. **Access Link:** The user opens the application URL. The system redirects them to the **Secure Login** page.
2. **PIN Authentication:** The user enters their unique 4-digit PIN (distributed beforehand by the committee via *Internal Email, Physical Slips, or Line Managers* before the dashboard goes live).
3. **Main Dashboard Access:** Upon a valid PIN check, the user enters the Main Dashboard where they can browse all Digimers' commitments, status badges, and measurable impacts. They can use the *Search Bar* or *Status Filter*.
4. **Open Update Form:** The user clicks the *"Update My Commitment Progress"* button. The system auto-fills their Name and Commitment.
    * *Special Scenario (Admin Revision):* If the commitment was modified by an Admin, a banner appears at the top: *"Your commitment has been updated by [Admin Name] on [Date/Time]"*.
    * *Special Scenario (New Employee):* If flagged as `NEW_USER`, the Commitment text field unlocks, allowing the user to type and submit their initial 6-month commitment for the first time.
5. **Conditional Form Input:**
    * Selects `Not Started` / `In Progress` → Fills out *Obstacles/Challenges* → Saves.
    * Selects `Achieved` → Fills out *Measurable Impact* (guided by the general placeholder) → Saves.
6. **History & Activity Logging:** The system inserts a new entry into the progress history table without overwriting past updates. The main dashboard updates immediately. The user can view their complete personal timeline of changes (status updates, added challenges, or impacts) directly under their form workspace.

### 4.2 Superuser Flow (Admin)
1. **Admin Login:** The Admin authenticates using a dedicated Admin PIN.
2. **Dashboard Review:** The Admin toggles the `⚠️ Needs Review` filter to isolate commitments imported from the initial spreadsheet that are deemed too optimistic, irrelevant, or unmeasurable within 6 months, alongside empty slots for new users.
3. **Revise Commitment:** The Admin clicks *Edit* on a flagged row, reframes the text to be more measurable, and saves.
4. **Audit Trail Entry:** The system automatically logs the old commitment text, new text, admin name, and timestamp into the `commitment_revisions` table.

---

## 5. Technology Stack
* **Frontend:** React.js + Vite (for high performance and fast build times), Tailwind CSS (for modern UI styling), Axios (for API communication).
* **Backend:** Node.js + Express.js (a RESTful API architecture decoupled from the Event Hub server).
* **Database:** PostgreSQL (utilizing a separate database instance from the Event Hub but cloning the `users` table structure initially).
* **Deployment:** Railway (independent deployment managing separate server and database instances).

---

## 6. Success Metrics & Release Criteria

### 6.1 Success Metrics
* **100% Adoption Rate:** Every registered Digimer successfully logs into the dashboard using their respective PIN within the first week of deployment.
* **Data Integrity:** Zero loss or accidental overwriting of historical progress entries when users perform periodic updates.
* **Admin Audit Completion:** All commitments initially marked as `⚠️ Needs Review` are successfully adjusted by the admin team or completed by new users before the mid-term review (Month 3).

### 6.2 Release Criteria
* Conditional form fields operate with 100% functional accuracy across both desktop and mobile viewports (fully responsive).
* The Challenges/Obstacles input field remains completely hidden from the public-facing dashboard under any circumstance to ensure internal privacy.
* Search queries and status filter transitions resolve with an API latency below 200ms.

---

## 7. Timeline & Release Plan

* **Week 1: Data Preparation & Backend Architecture**
    * Initialize the new repositories (React & Node.js) on Railway.
    * Clone the identity data (`users` and `pins`) from the Event Hub database into this new instance.
    * Batch import the initial commitments from the Excel/Spreadsheet into the `initial_commitment` column, assigning the appropriate `review_reason` (`NOT_MEASURABLE` / `TOO_OPTIMISTIC` / `NEW_USER`).
    * Launch the PIN distribution protocol to employees via automated internal emails or physical desk slips.
* **Week 2: UI Development & Conditional Form Logic**
    * Complete UI slicing for the Secure Login gateway and the Main Dashboard table (incorporating Search, Status Filter, and dynamic hover tooltips).
    * Build the conditional rendering logic for the update form fields (Challenges vs. Measurable Impact) and unlock input access for `NEW_USER` states.
* **Week 3: Admin Module & Audit Trail Implementation**
    * Develop the inline editing capability for Superusers and hook it up to the `commitment_revisions` logger.
    * Implement the admin dashboard's `Needs Review` filter view and hook up the user-facing alert banners and personal activity logs.
* **Week 4: Testing & Official Launch (Go-Live)**
    * Conduct end-to-end integration testing, focusing on edge-case inputs and PIN security gates.
    * Officially release the dashboard link to all Digimers prior to the main anniversary event schedule.