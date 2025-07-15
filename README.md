Live link : https://frontend-chat-app-gules.vercel.app
 Next.js Chat App
A modern chatroom app built with Next.js 14, Tailwind CSS, Redux, Zod, react-hook-form, Heroicons, and next-themes. Users can register, sign in, create and manage chatrooms, and chat in real-time.

⚠️ Note: The OTP feature is a placeholder — users can enter any random OTP to complete login or registration. There is no real OTP validation implemented.

✅ Features
User Registration & Sign-In (Mobile Number + OTP)

OTP input accepts any value

Create, Edit, Delete Chatrooms

Search Chatrooms

Realtime Chatroom UI

Image Upload & Message Copy

Dark Mode with next-themes

Fully Responsive (Tailwind CSS)

Form Validation with react-hook-form & Zod

Toast Notifications (react-hot-toast)

Global State Management (Redux)

📂 Project Structure
bash
Copy
Edit
📦 your-project/
 ├── app/                 # Next.js app directory (pages/routes)
 ├── components/          # Shared UI components
 ├── hooks/               # Custom hooks (chatroom logic, context)
 ├── store/               # Redux store and auth slice
 ├── actions/             # CRUD actions & auth logic
 ├── config/              # Constants & routes
 ├── styles/              # Global CSS & Tailwind config
 ├── tailwind.config.ts   # Tailwind configuration
 ├── package.json
 └── README.md
⚡ Getting Started
1️⃣ Clone the repository

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2️⃣ Install dependencies

npm install
3️⃣ Run the app

npm run dev
Visit http://localhost:3000


🌙 Dark Mode
Uses next-themes.

Toggle between light & dark.

Fully styled with Tailwind CSS.

🚧 Important
OTP is not validated — you can enter any random OTP to log in.

Demo only — does not send real OTPs.

🛠️ Tech Stack
Next.js 14

Tailwind CSS

Redux Toolkit

Zod & react-hook-form

next-themes

Heroicons

react-hot-toast

Directions to use the app
1. Register yourself on the registration page.

2.Login using your mobile number.

3.Once logged in, you’ll see your dashboard.

4.Create new chatrooms and manage them.

5.Click on any chatroom card to open and view the chats.
