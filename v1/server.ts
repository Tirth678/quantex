import app from './src/app.ts'
import {CONFIG} from './src/config/config.ts'

app.listen(CONFIG.PORT, () => {
    console.log(`Quantex working on server 3000`);
})