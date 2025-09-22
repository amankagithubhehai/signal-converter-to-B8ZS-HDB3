# Scrambling Simulation (B8ZS & HDB3)

This project is an **interactive web-based simulation** that demonstrates two popular line coding scrambling techniques:  
- **B8ZS (Bipolar with 8-Zero Substitution)**  
- **HDB3 (High-Density Bipolar of Order 3)**  

It helps students and networking enthusiasts understand how these schemes replace long runs of zeros to maintain synchronization in digital communication systems.

---

## 🚀 Features
- Enter any custom **bit sequence**.
- Simulate both **B8ZS** and **HDB3** scrambling schemes.
- Interactive **waveform visualization** using **D3.js**.
- Modern, responsive **UI with CSS styling**.
- Explanation box that updates with each scheme.

---

## 📂 Project Structure
```
📁 Scrambling-Simulation
│── innovative.html   # Main HTML page
│── styles.css        # Stylesheet (UI design)
│── script.js         # JavaScript logic + D3.js visualization
```

---

## ⚡ How to Run
1. Download or clone this repository.  
2. Ensure all files (`innovative.html`, `styles.css`, `script.js`) are in the same directory.  
3. Open `innovative.html` in any modern browser (Chrome, Edge, Firefox).  
4. Enter a **bit sequence** (e.g., `1000001000001`).  
5. Click **B8ZS** or **HDB3** to see the simulation.  

---

## 🛠️ Built With
- **HTML5** – Page structure  
- **CSS3** – Styling and layout  
- **JavaScript (ES6)** – Simulation logic  
- **D3.js** – Graph rendering  

---

## 📘 Example
Input Sequence:  
```
1000001000001
```

- **B8ZS** → Replaces 8 consecutive zeros with a substitution pattern.  
- **HDB3** → Replaces 4 consecutive zeros with a violation pattern.  

The waveform is dynamically drawn in the graph section.

---

## 📜 License
This project is free to use for **educational and personal** purposes.
