require('./src/config/config');
const app = require('./src/app');
const connectDB = require('./src/config/db');

async function startServer() {

    await connectDB();

    app.listen(3000, () => {
        console.log('Server is running');
    })
    
}

startServer();