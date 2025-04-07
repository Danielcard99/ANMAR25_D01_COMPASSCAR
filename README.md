# 🚗 Car API

This is a simple RESTful API to manage cars and their items using **Node.js**, **Express**, **Sequelize**, and **MySQL**.

## 📦 Technologies Used

- **Node.js** – JavaScript runtime
- **Express** – Web framework for Node.js
- **Sequelize** – ORM to interact with MySQL
- **MySQL** – Relational database
- **CORS** – Middleware for cross-origin requests
- **Dotenv** – To manage environment variables

## 🧑‍💻 Step-by-Step Guide to Run the Project

### 1. Install Git and Node.js

Make sure you have [Git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/) installed on your computer.

### 2. Clone the Project

Open your terminal and run:

```bash
git clone https://github.com/Danielcard99/ANMAR25_D01_COMPASSCAR.git
cd ANMAR25_D01_COMPASSCAR
```

### 3. Install the Project Dependencies

Still in the terminal, run:

```bash
npm install
```

### 4. Configure the Environment Variables

Create a `.env` file in the project root and add your MySQL credentials:

```
DB_NAME=your_database_name
DB_USER=your_mysql_user
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_DIALECT=mysql
```

### 5. Set Up Your Database

Make sure MySQL is running. You can use tools like MySQL Workbench or DBeaver to create your database.

### 6. Run the Project

Start the server with:

```bash
npm start
```

You should see a message that the server is running.

## 🗂️ How to Use the API (Endpoints)

### Create a Car

**Method:** POST  
**URL:** `/api/v1/cars`  
**Example Body:**

```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2022
  "plate": "ABC-1A23",
}
```

### Update a Car (Partially)

**Method:** PATCH  
**URL:** `/api/v1/cars/:id`  
**Example Body:**

```json
{
  "brand": "Honda",
  "model": "Civic",
  "plate": "XYZ-1B23"
}
```

### Get Cars with Filters and Pagination

**Method:** GET  
**URL Example:** `/api/v1/cars?year=2020&final_plate=3&brand=Toyota&page=1&limit=5`

### Get Car by ID (with Items)

**Method:** GET  
**URL:** `/api/v1/cars/:id`

### Add Items to a Car

**Method:** PUT  
**URL:** `/api/v1/cars/:id/items`  
**Example Body:**

```json
["air conditioning", "power windows", "alarm"]
```

- Max: 5 items
- No duplicates

### Delete a Car

**Method:** DELETE  
**URL:** `/api/v1/cars/:id`

## 📝 Important Notes

- License plate must follow this format: `ABC-1A23`
- Year must be between current year - 9 and current year + 1
- When updating the `brand`, you must also provide the `model`

## 📁 Folder Structure

```
ANMAR25_D01_COMPASSCAR/
├── config/
│   └── database.js
├── controllers/
│   └── carController.js
├── middlewares/
│   ├── errorHandler.js
│   ├── validateCarData.js
│   ├── validateItems.js
│   └── validatePartialUpdate.js
├── models/
│   ├── Cars.js
│   └── CarsItem.js
├── routes/
│   └── carRoutes.js
├── utils/
│   ├── isValidPlate.js
│   └── toSnakeCase.js
├── .env
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## 👨‍💻 Author

- Daniel Cardoso

## 📝 License

This project is licensed under the ISC License.
