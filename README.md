# Dashboard Application

## Overview
This is a task management dashboard application that allows users to manage their daily tasks with a user-friendly interface. The app features a real-time analog clock, task tracking, and user authentication.

## Features
- **User Authentication:** Secure login system with session-based access control.
- **Task Management:**
  - View daily tasks.
  - Add new tasks.
  - Toggle task completion status.
- **Real-Time Analog Clock:** A dynamic analog clock displaying the current time.
- **Responsive Design:** Mobile-friendly interface.

## Tech Stack
- **Frontend:**
  - [React](https://reactjs.org/)
  - [Next.js](https://nextjs.org/)
  - [TailwindCSS](https://tailwindcss.com/)
- **Backend:**
  - [NextAuth.js](https://next-auth.js.org/) for authentication.
  - [Prisma](https://www.prisma.io/) as the ORM.
  - RESTful API endpoints for task operations.
- **Database:**
  - PostgreSQL.

## Prerequisites
Ensure you have the following installed on your system:
- Node.js (v14+)
- npm, yarn, or pnpm
- PostgreSQL

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo-url/dashboard-app.git
   cd dashboard-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   Or, if you're using `pnpm`:
   ```bash
   pnpm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/database_name"
   NEXTAUTH_SECRET="your_secret_key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Or, if you're using `pnpm`:
   ```bash
   pnpm dev
   ```

6. Open the app:
   Navigate to `http://localhost:3000` in your browser.

## Folder Structure
```
|-- components
|   |-- ClockSection.tsx       # Real-time analog clock component
|   |-- TaskItem.tsx           # Individual task item component
|-- lib
|   |-- prisma.ts              # Prisma client instance
|-- pages
|   |-- api
|   |   |-- auth
|   |   |   |-- [...nextauth].ts  # NextAuth configuration
|   |   |-- tasks
|   |       |-- [id]/toggle.ts # Toggle task completion API
|   |       |-- index.ts       # Create task API
|   |-- dashboard
|       |-- index.tsx          # Main dashboard page
|-- prisma
|   |-- schema.prisma          # Database schema
|-- public
|   |-- default-profile.png    # Default user profile image
|   |-- clock.png              # Placeholder clock image (if applicable)
|-- styles
|   |-- globals.css            # Global TailwindCSS styles
```

## API Endpoints
### **Authentication**
- **POST** `/api/auth/[...nextauth]`: Handles user authentication.

### **Tasks**
- **GET** `/api/tasks`: Fetch all tasks for the logged-in user.
- **POST** `/api/tasks`: Add a new task.
  - Body: `{ "title": "Task Title" }`
- **PUT** `/api/tasks/{id}/toggle`: Toggle task completion status.

## Usage
### Add a Task
1. Enter a task name in the input field.
2. Click the "Add" button to save the task.

### Toggle Task Completion
1. Click on the checkbox next to a task to mark it as completed or incomplete.

### Real-Time Clock
The analog clock updates dynamically to reflect the current time.

## Development Tips
- Use `npx prisma studio` to visually manage your database.
- TailwindCSS utility classes are used extensively for styling.
- All API routes are defined under the `pages/api` folder.

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For inquiries, please contact [your-email@example.com](mailto:your-email@example.com).

