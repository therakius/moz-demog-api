# Moz-Demog-API

> 📘 Para ler em português, clique [aqui](./README_pt.md)

**Moz-Demog-API** is a public RESTful API that provides **Mozambique's demographic data from 2017 to 2026**, delivered in standard JSON format.

It was built to support:
- Developers building data-driven applications
- Programming students practicing API consumption
- Data scientists performing population analysis
- Anyone with technical knowledge who needs access to structured demographic data

All datasets are sourced from the official **[National Institute of Statistics of Mozambique (INE)](https://www.ine.gov.mz/)**.

📄 **API Documentation**:  
You can view and interact with the documentation at  
👉 [https://moz-demog-api.onrender.com](https://moz-demog-api.onrender.com)

---

## 📦 Tech Stack & Tools

**Languages & Frameworks**
- HTML, CSS, JavaScript
- Node.js, Express.js

**Data & Modeling**
- PostgreSQL
- PlantUML (for diagrams)

**Tooling**
- Visual Studio Code
- Postman

---

## 🗂 Endpoints Overview (English)

| Resource     | Endpoint                                | Method |
|--------------|------------------------------------------|--------|
| Country Data | `/api/country`                          | GET    |
| Provinces    | `/api/provinces/:year`                  | GET    |
| Districts    | `/api/districts/:province_id/:year`     | GET    |
| Indicators   | `/api/indicators/:province_id/:year`    | GET    |

For full parameter details and example responses, visit the [documentation](https://moz-demog-api.onrender.com).

---

## 📌 Limitations

- Province- and district-level data is only available for **2023**
- Hosted on a free-tier service, so expect **cold starts** and **limited performance**
- Write operations (POST, PUT, DELETE) are **not supported** in the current version

---

## 🤝 Contact

For suggestions, issues, or collaborations, feel free to reach out:

📫 Email: [therakius.dev@gmail.com](mailto:therakius.dev@gmail.com)

---


<p align="center"> Developed by <a href="https://github.com/therakius">therakius</a>.</p>

