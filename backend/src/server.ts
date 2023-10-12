import app from './app'; // Assuming your app configuration is in app.ts

const port = process.env.PORT || 3001; // Use the specified port or a default one

app.listen(port, () => {
  console.log(`Server, Server is listening on port ${port}`);
});