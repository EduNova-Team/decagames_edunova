# DECAgames - Interactive DECA Competition Practice

DECAgames is a web application designed to help DECA competitors prepare for competitions by transforming standard practice test PDFs into interactive quiz-style games. This application makes studying more engaging and effective.

## Features

- **PDF Upload**: Upload your DECA practice test PDFs
- **Interactive Games**: Play through questions in a Kahoot/Quizlet-style game format
- **Review Mode**: Review answers with detailed explanations from the original PDF
- **Progress Tracking**: Keep track of your completed practice tests
- **Mobile Responsive**: Use on any device for studying on-the-go

## Technology Stack

- **Frontend Framework**: Next.js and React
- **Styling**: Tailwind CSS and DaisyUI
- **PDF Processing**: pdf-parse
- **File Uploads**: react-dropzone

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/decagames.git
   cd decagames
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. From the homepage, click on "Upload PDF"
2. Drag and drop your DECA practice test PDF or click to select from files
3. Once uploaded, the system will process the PDF and create a game
4. Click "Start Game" to begin practicing
5. Answer questions and see your results
6. Review your answers with the "Review Answers" feature

## Future Enhancements

- User authentication for saving progress
- Advanced PDF parsing to handle different test formats
- Competitive multiplayer mode
- Spaced repetition for questions you get wrong
- Analytics to track improvement over time
- Custom game creation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- DECA Inc. for providing valuable educational resources
- All DECA advisors and students who provide feedback
