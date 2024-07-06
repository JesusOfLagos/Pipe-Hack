import express, { Request, Response } from 'express';
import { authenticator, totp } from 'otplib';
import QRCode from 'qrcode';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory storage for simplicity (should be replaced with a database in production)
let users: { [username: string]: any } = {};

// Endpoint to register a user and get the initial secret and QR code for authenticator apps
app.post('/register-authenticator', async (req: Request, res: Response) => {
  const secret = authenticator.generateSecret();

  // Save the user and their secret in your storage (in this case, an in-memory object)
  users[req.body.username] = {
    secret,
    username: req.body.username,
    verified: false,
    useAuthenticator: true
  };

  // Generate a QR code that the user can scan with their 2FA app
  const otpauthUrl = authenticator.keyuri(req.body.username, 'MyApp', secret);
  try {
    const QRCodeImage = await QRCode.toDataURL(otpauthUrl);
    res.json({ secret, QRCode: QRCodeImage });
  } catch (err) {
    console.error('Error generating QR Code:', err);
    res.status(500).json({ message: 'Failed to generate QR Code' });
  }
});

// Endpoint to register a user and send OTP via SMS or email
app.post('/register-otp', (req: Request, res: Response) => {
  const { username, method } = req.body;

  // Generate a 6-digit OTP
  const otp = totp.generate(users[username].secret);

  // Save the OTP in your storage (in this case, an in-memory object)
  users[username] = {
    otp,
    username,
    method, // 'sms' or 'email'
    verified: false,
    useAuthenticator: false
  };

  res.json({ message: 'OTP generated successfully' });
});

// Endpoint to verify the token (both for authenticator apps and OTPs)
app.post('/verify', (req: Request, res: Response) => {
  const { token, username } = req.body;
  const user = users[username];

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  let verified = false;

  if (user.useAuthenticator) {
    verified = authenticator.verify({
      token,
      secret: user.secret
    });
  } else {
    verified = totp.check(token, user.secret);
  }

  if (verified) {
    users[username].verified = true;
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
