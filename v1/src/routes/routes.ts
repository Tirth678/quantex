import express from 'express'
import app from '../app.ts'
import bcrypt from 'bcrypt';
import  jwt from 'jsonwebtoken';
import {CONFIG} from '../config/config.ts'
const saltRounds = 10;


// --- In-memory state ---
const USERS: any = [];
const STOCKS = [
  { id: 1, title: "AXIS BANK", symbol: "AXIS" },
  { id: 2, title: "HDFC BANK", symbol: "HDFC" },
  { id: 3, title: "TATA Steel", symbol: "TATA" },
];
const ORDERS = [];
const FILLS = [];
const BALANCES = {}; // { userId: { INR: {available, locked}, AXIS: {available, locked}, ... } }
const ORDERBOOK = {
  AXIS: { bids: {}, asks: {} },
  HDFC: { bids: {}, asks: {} },
  TATA: { bids: {}, asks: {} },
};

// --- Auth ---
app.post("/signup", async (req, res) => {
  // 4. init BALANCES[userId] with INR: { available: 0, locked: 0 }
  try {
    const {id, username, password} = req.body;
  if(!username){
    return res.status(411).json({message: "User not found"});
  }
  const hashedPass = await bcrypt.hash(password, saltRounds);

  USERS.push(username, hashedPass);

  const token = jwt.sign({
    id
  }, CONFIG.JWT_SECRET!);

  

  res.status(200).json({message: "User created succesfully"});

  } catch (error) {
    console.log(`Error in creating user ${error}`);
  }
});

app.post("/login", async (req, res) => {

  try {
    const {id, username, password} = req.body;
    const { userName } = USERS.map((user: any) => {user.username === USERS.username});
    if(!userName){
        return res.status(404).json({message: "User not found"});
    }
   const passValid = await bcrypt.compare(password, userName.password);
    const token = jwt.sign({
        userId: USERS.id
    }, CONFIG.JWT_SECRET!);

    res.status(200).json({message: "Login successfull"})

  } catch (error) {
    console.log(`Error in login ${error}`);
  }

});

// --- Orders ---
app.post("/order", (req, res) => {
  // body: { userId, side: "BUY"|"SELL", type: "LIMIT"|"MARKET", symbol, price?, qty }
  // 1. validate input + stock exists
  // 2. check + lock balance (INR for BUY, stock for SELL)
  // 3. run matching engine against opposite side of ORDERBOOK
  // 4. write fills to FILLS, update filledQty + status on ORDERS
  // 5. if leftover qty and LIMIT, rest on book; if MARKET, cancel remainder
  // 6. settle balances on each fill (move locked -> other asset's available)
});

app.delete("/order/:orderId", (req, res) => {
  // 1. find order, check ownership
  // 2. remove from ORDERBOOK price level
  // 3. unlock remaining reserved balance
  // 4. mark status = CANCELLED
});

app.get("/orders", (req, res) => {
  // query: ?status=OPEN  (or all)
  // return current user's orders
});

// --- Market data ---
app.get("/orderbook/:symbol", (req, res) => {
  // return aggregated depth — totalQty per price level for bids and asks
  // (don't expose individual userIds to other users)
});

app.get("/fills/:symbol", (req, res) => {
  // recent trades for this stock — the "tape"
});

app.get("/stocks", (req, res) => {
  res.json(STOCKS);
});

// --- User data ---
app.get("/balance", (req, res) => {
  // return BALANCES[userId] for the authed user
});
