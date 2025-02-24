﻿# Aluminium Wire Rod Quality Control System
![image](frontend/public/img/auth/auth.png)
## Background

Aluminium wire rod is produced in wire rod mills of the cast house. The process involves:

- Casting an aluminium bar with a trapezoidal cross-section of 3437 sq. mm.
- Rolling the bar through 15 stands in series to reduce the cross-section to a final 9.5 mm diameter rod.

### Key Parameters Affecting Wire Rod Properties:

1. Chemical composition
2. Casting temperature
3. Cooling water temperature
4. Casting speed
5. Cast bar entry temperature at the rolling mill
6. Emulsion temperature and pressure at the rolling mill
7. Emulsion concentration
8. Rod quench water pressure

### Challenges

These parameters are dynamic, and deviations affect key rod properties like:

- Ultimate Tensile Strength (UTS)
- Elongation
- Conductivity

## Solution

Our AI-based system provides real-time monitoring, analysis, and prediction of rod properties through the following features:

### Features

1. **Forward Prediction:**

   - Reads feature parameters (e.g., rolling mill temperature, pressure, etc.) from a database.
   - Processes raw data through a preprocessing pipeline.
   - Trains 3 AI/ML models and selects the best prediction for:
     - Elongation
     - Conductivity
     - UTS

2. **Backward Prediction:**

   - Allows users to input desired values for elongation, conductivity, and UTS.
   - Predicts required feature values and identifies deviations from actual values.

3. **Chatbot Integration:**

   - Allows queries based on historical data.
   - Example: "What was the UTS of the rod at 11:00 PM on 21/12/24?"

4. **Real-Time Monitoring:**

   - Automatically refreshes data every 5 seconds.
   - Flexible for modifications as per operational conditions.


---

## Requirements

- Python 3.8 or higher
- Node.js 14 or higher
- npm 6 or higher


---

## Installation Guide

### Step 1: Create Python Environment

```
python -m venv venv # or python3 -m venv venv
source venv/bin/activate # for linux or WSL systems
.\venv\Scripts\activate # for windows system
```

### Step 2: Install Dependencies inside the venv terminal

```
pip install -r requirements.txt
```

### Step 3: Run Frontend Development Server outside the venv (in a seperate second terminal)

```
cd frontend
npm i
npm run dev
```

### Step 4: Start Backend Application (inside the first venv terminal)

```
python app.py
```

### Step 5: Start Chatbot Server (in a third terminal)

```
cd frontend
node server.js
```
### Now you can demo everything, including the chatbot which shall respond to prompts such as

2024-09-02T09:47:00Z uts
---

## Usage

1. Open the application in your browser after starting the servers.
2. Navigate through the dashboard for predictions and parameter analysis.
3. Use the chatbot for historical queries.
4. Monitor real-time updates on rod quality parameters.

---

## License

This project is licensed under the MIT License. It was ideated and prototyped during Smart India Hackathon 2024.

---

## Support

For any issues or queries, please contact swarnsiddhigoldenedition\@gmail.com

