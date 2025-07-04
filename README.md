readme:
  title: "📚 BookStore"
  description: "A simple web application to manage your personal collection of books. Users can add, view, and delete books using a clean, responsive interface."

  features:
    - "Add new books with title, author, genre, and description"
    - "View a list of all added books"
    - "View detailed information for each book"
    - "Delete books you no longer need"
    - "Flash messages for actions (success/errors)"
    - "User authentication (register/login)"
    - "Responsive UI using EJS templates"

  tech_stack:
    frontend: "HTML, CSS, EJS"
    backend: "Node.js, Express.js"
    database: "MongoDB"
    tools: "Git, Nodemon"
```
  project_structure: |
    BookStore/
    ├── models/                   # Mongoose schemas (book.js, user.js)
    ├── public/
    │   ├── javascript/           # Form validation scripts (validatedForm.js)
    │   └── stylesheets/          # CSS styles (home.css)
    ├── views/
    │   ├── books/                # Pages: index, new, edit, show
    │   ├── users/                # Pages: login, register
    │   ├── layouts/              # Boilerplate layout
    │   ├── partials/             # Navbar, footer, flash messages
    │   └── home.ejs              # Landing page
    ├── .gitignore
    ├── Procfile
    ├── README.md
    ├── index.js                  # Main server file
    ├── seeds.js                  # Database seeding
    ├── vercel.json               # Vercel deployment config
    ├── package.json              # Project metadata and dependencies
    └── package-lock.json         # Dependency tree lock
```
  getting_started:
  
    prerequisites:
    
      - "Node.js and npm"
      - "MongoDB (local or Atlas)"
      
    installation: |
    
      git clone https://github.com/manishreddy731/BookStore.git
      
      cd BookStore
      
      npm install
      
    run_local: |
    
      npm start
      
      # Visit http://localhost:8000  
screenshots:
  
HOME page:
![Screenshot 2025-07-04 153610](https://github.com/user-attachments/assets/02ab3d65-2c4e-4547-98a2-673da69a4d36)
SIGN UP page:
![Screenshot 2025-07-04 153639](https://github.com/user-attachments/assets/afe81f7a-a969-4db1-ba26-0ee782f4646b)
LOGIN page:
![Screenshot 2025-07-04 153649](https://github.com/user-attachments/assets/6f9b5036-1407-47f7-8de9-9361c722ab32)
ADD A BOOK page:
![Screenshot 2025-07-04 153712](https://github.com/user-attachments/assets/68cd22c4-2f9c-45f2-9081-158143863011)
BOOKS DATABASE page:
![Screenshot 2025-07-04 153622](https://github.com/user-attachments/assets/4876ca0f-0888-4db8-b950-d65550a29997)
"
contributing: "Feel free to fork this repo and submit pull requests.
  license: "MIT"

  author:
  
    name: "Manish Reddy"
    
    github: "https://github.com/manishreddy731"
