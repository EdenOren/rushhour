# Rush Hour: AI Gridlock Escape!

A modern take on the classic Rush Hour puzzle game, powered by Google's Gemini AI to generate unique and challenging puzzles on demand. Move the cars and trucks to clear a path for your green car to reach the exit!

**[➡️ View Live Demo](https://rushhour-ai.vercel.app)**

 
![image](https://github.com/user-attachments/assets/645bc27c-932b-4811-bb50-b7790d8802d9)


---

## ✨ Features

-   **Dynamic Puzzle Generation**: Never play the same game twice! A new puzzle is generated every time you click "New Game".
-   **AI-Powered**: Leverages Google's Gemini AI to create valid, solvable puzzles based on your chosen difficulty.
-   **Multiple Difficulty Levels**: Choose between Easy, Medium, and Hard to match your skill level.
-   **Interactive Grid**: A smooth, draggable interface for moving the vehicles.
-   **"How to Play" Guide**: A quick in-game modal to explain the rules to new players.
-   **Sleek & Responsive UI**: A clean and modern design that works on various screen sizes.

---

## 🤖 How It Works

This project combines a modern Angular frontend with an intelligent serverless backend.

1.  **User Request**: The player selects a difficulty and requests a new game from the Angular frontend.
2.  **API Call**: The frontend sends a request to a Vercel Serverless Function.
3.  **AI Puzzle Generation**: The serverless function acts as a secure backend that calls the **Google Gemini API**. It provides a detailed system prompt instructing the AI to act as a Rush Hour puzzle expert.
4.  **Structured Response**: The AI is instructed to return a puzzle that is guaranteed to be valid, solvable, and in a specific JSON format.
5.  **Game Setup**: The frontend receives the JSON data and dynamically builds the game board, placing the vehicles in their starting positions.

---

## 🛠️ Technologies Used

-   **Frontend**:
    -   [Angular](https://angular.io/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [SCSS](https://sass-lang.com/)
    -   [ngx-gridster2](https://github.com/tiberiuzuld/angular-gridster2) for the draggable grid layout.
    -   [ngx-toastr](https://github.com/scttcper/ngx-toastr) for notifications.

-   **Backend**:
    -   [Node.js](https://nodejs.org/)
    -   [Vercel Serverless Functions](https://vercel.com/docs/functions)

-   **AI**:
    -   [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash` model)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed:
-   Node.js (which includes npm)
-   Angular CLI: `npm install -g @angular/cli`
-   Vercel CLI: `npm install -g vercel`

---
