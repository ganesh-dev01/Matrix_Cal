# Matrix Calculator

This project is a Matrix Calculator that allows users to generate matrices, perform various operations on them, and display the results. The application is built using React and utilizes Web Workers for efficient matrix operations and `react-window` for optimal rendering of large tables.

## Features

- Generate two matrices:
  - Table 1: Sum of Indices
  - Table 2: Product of Indices
- Perform operations (Add, Subtract, Multiply) on the generated matrices
- Display the result of the operation in a separate table
- Responsive design with a clean and user-friendly interface

## Technologies Used

- React
- TypeScript
- Material-UI
- react-window
- Web Workers

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation



1. Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev

```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/matrix/index.tsx`: Main page component that handles user input, matrix generation, and matrix operations.
- `src/matrix/MatrixTable.tsx`: Component for rendering matrices using `react-window`.
- `public/matrixWorker.js`: Web Worker script for performing matrix operations in the background.
- `src/styles/Matrix.module.css`: CSS module for styling the Matrix page.

## Usage

1. Enter the number of rows and columns for the matrices.
2. Click the "Generate" button to create the matrices.
3. Select an operation (Add, Subtract, Multiply) from the dropdown menu.
4. Click the "Perform Operation" button to see the result in a separate table.



## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Acknowledgements

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [react-window](https://github.com/bvaughn/react-window)
- [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)