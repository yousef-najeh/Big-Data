# Twitter Stream Processing Pipeline

## Project Overview

The **Twitter Stream Processing Pipeline** is an application that designed to handle, process, and visualize insights about tweets in real-time. The pipeline ingests tweets from a simulated generator, processes and handle the data in a scala producer, and send data in python consumer and renders the results in a user-friendly web application using express & react. It supports searchability across text, time, and location.

---

## Installation and Setup

### Prerequisites

-   **Programming Languages:** Python 3.8+, JavaScript, scala
-   **Docker**

### Steps to Set Up

### Step 1: Navigate to the Directory

```bash
docker compose up -d
```

### Step 2: Run Scala

### Step 3: Navigate to the elasticsearch Directory

**[Optional: Set up Virtual Environment]**

-   **For Windows:**

    ```bash
    python -m venv .venv
    .venv\Scripts\activate
    ```

-   **For macOS/Linux:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt

python elasticsearch-consumer.py
```

### Step 5: Navigate to backend Directory

#### Set up .env file

-   **For Windows:**

    ```bash
    copy .env.example .env
    ```

-   **For macOS/Linux:**
    ```bash
    cp .env.example .env
    ```

### Step 6: Install Dependencies

```bash
npm i
```

### Step 7: Run the Backend

```bash
npm run start
```

### Step 8: Navigate to frontend Directory

#### Set up .env file

-   **For Windows:**

    ```bash
    copy .env.example .env
    ```

-   **For macOS/Linux:**
    ```bash
    cp .env.example .env
    ```

### Step 9: Install Dependencies

```bash
npm i
```

### Step 10: Run the Frontend

```bash
npm run start
```
