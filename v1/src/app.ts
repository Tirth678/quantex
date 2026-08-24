import express from 'express';
import type {Request, Response} from 'express';

const app = express();
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({message: "Server is working and healthy"})
})

export default app;