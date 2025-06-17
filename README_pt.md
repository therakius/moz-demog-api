# Moz-Demog-API

> 🇬🇧 To read in English, click [here](./README.md)

**Moz-Demog-API** é uma API pública RESTful que fornece **dados demográficos de Moçambique entre 2017 e 2026**, no formato padrão JSON.

Ela foi desenvolvida para atender:
- Desenvolvedores construindo aplicações baseadas em dados
- Estudantes de programação praticando consumo de APIs
- Cientistas de dados realizando análises populacionais
- Qualquer pessoa com conhecimento técnico que precise de dados demográficos estruturados

Todos os dados foram obtidos a partir dos recursos disponíveis no site oficial do **[Instituto Nacional de Estatística de Moçambique (INE)](https://www.ine.gov.mz/)**.

📄 **Documentação da API**  
Você pode visualizar e interagir com a documentação em:  
👉 [https://moz-demog-api.onrender.com](https://moz-demog-api.onrender.com)

---

## 📦 Tecnologias e Ferramentas

**Linguagens e Frameworks**
- HTML, CSS, JavaScript
- Node.js, Express.js

**Banco de Dados e Modelagem**
- PostgreSQL
- PlantUML (para diagramas)

**Ferramentas de Desenvolvimento**
- Visual Studio Code
- Postman

---

## 🗂 Visão Geral dos Endpoints

| Recurso      | Endpoint                                 | Método |
|--------------|------------------------------------------|--------|
| Dados do país | `/api/country`                          | GET    |
| Províncias    | `/api/provinces/:year`                  | GET    |
| Distritos     | `/api/districts/:province_id/:year`     | GET    |
| Indicadores   | `/api/indicators/:province_id/:year`    | GET    |

Para detalhes completos de parâmetros e exemplos de resposta, acesse a [documentação](https://moz-demog-api.onrender.com).

---

## 📌 Limitações

- Dados ao nível de província e distrito estão disponíveis apenas para o ano de **2023**
- A API está hospedada em um serviço gratuito, então podem ocorrer **inicializações lentas** e **limitações de desempenho**
- Operações de escrita (POST, PUT, DELETE) **não são suportadas** nesta versão

---

## 🤝 Contato

Para sugestões, dúvidas ou colaborações, entre em contato:

📫 Email: [contato@mozdemogapi.me](mailto:contato@mozdemogapi.me)

---

<p align="center"> Developed by <a href="https://github.com/therakius">therakius</a>.</p>
