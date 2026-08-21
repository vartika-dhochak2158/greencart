import cors from 'cors';

const allowedOrigins = [
    'http://localhost:5173',
    'https://greencart-app-ruddy.vercel.app' // Add your exact Vercel URL
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Or callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}));