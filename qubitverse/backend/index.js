const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();

app.use(express.text());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.post("/encode", async (req, res) => {
  const data = req.body;
  const cppProcess = spawn("../simulator/simulator/temp");
  let output = "";

  // Collect output from the C++ program
  cppProcess.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });

  // Handle errors
  cppProcess.stderr.on("data", (chunk) => {
    console.error(`Error from C++ parser: ${chunk}`);
  });

  // When the process completes
  cppProcess.on("close", (code) => {
    if (code === 0) {
      res.send(output);
    } else {
      res.status(500).send("Error processing input");
    }
  });

  // Send the text directly to the C++ program's stdin
  cppProcess.stdin.write(data); // Changed from gateData to data
  cppProcess.stdin.end();
  
  // Remove the second res.send() that was causing the error
  // res.send("Data received");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});