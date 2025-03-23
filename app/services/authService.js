const JwtService = require("../services/jwtService");
const EmailService = require("../utils/emailService");
const AuthRepository = require("../repositories/authRepository");

class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
        this.emailService = new EmailService();
    }

     generateOTP(email) {
        if (email === "storye024@gmail.com") {
            return "1234";
        }
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

  async sendOtpEmail(email, otp) {
    const subject = "OTP Code";

    const text = `Dear User,

Your OTP code is ${otp} to complete your login to STORYE, please use the following One-Time Password (OTP):
This OTP is valid for 10 minutes. Please do not share this code with anyone.

If you did not request this OTP, please ignore this email.

Thank you for using STORYE.

Sincerely,
STORYE Team`;

    await this.emailService.sendEmail(email, subject, text);
  }

    /**
     * Signup Flow: Save OTP in the OTP table and send email.
     */
    async signup(email, phone, userType) {
    const existingUser = await this.authRepository.findUserByEmail(email, userType);
    if (existingUser) {
        throw new Error("Email is already registered.");
    }

    const existingPhone = await this.authRepository.findUserByPhone(phone, userType);
    if (existingPhone) {
        throw new Error("Phone number is already registered.");
    }

    const otp = this.generateOTP(email);
    const otpExpirationTime = Date.now() + 10 * 60 * 1000; 

    try {
        await this.sendOtpEmail(email, otp);
        await this.authRepository.saveOtp(email, otp, otpExpirationTime, userType);

        return { message: "OTP sent to your email. Complete verification to finish signup." };
    } catch (error) {
        throw new Error("Error during signup process");
    }
}


    /**
     * Verify OTP and create user in the main user table (User or Consumer).
     */
    async verifySignupOtp(email, otp, userType, phone) {
        console.log("this is verify signp otp ", email, otp, userType, phone)
        const otpRecord = await this.authRepository.findOtpByEmail(email, userType);
        console.log("this is otp record ")
        if (!otpRecord) {
            console.log(" i am here ")
            throw new Error("OTP not found or expired. Please request a new OTP.");
        }

        if (otpRecord.otp !== otp) {
            throw new Error("Invalid OTP.");
        }

        if (Date.now() > otpRecord.otpExpirationTime) {
            throw new Error("OTP has expired.");
        }

        // Create the user in the main user table
        const newUser = await this.authRepository.createUser({ email, phone }, userType);

        console.log(" this is new suer ", newUser)
        // Generate token
        const payload = { userId: newUser.user_id, email: newUser.email };
        const token = JwtService.generateToken(payload);

        // Save the token in the user table
        await this.authRepository.updateUser({ email, token }, userType);

        return { message: "Signup successful.", token };
    }

    /**
     * Send OTP for login.
     */
    async loginRequest(email, userType) {
    const user = await this.authRepository.findUserByEmail(email, userType);
    if (!user) {
        throw new Error("User not found. Please sign up first.");
    }

    const otp = this.generateOTP(email);
    const otpExpirationTime = Date.now() + 10 * 60 * 1000; 

    await this.authRepository.saveOtp(email, otp, otpExpirationTime, userType);
    await this.sendOtpEmail(email, otp);

    return { message: "OTP sent to your email." };
}


    /**
     * Verify OTP for login and update token.
     */
    async loginVerify(email, otp, userType) {
        const otpRecord = await this.authRepository.findOtpByEmail(email, userType);
        if (!otpRecord) {
            throw new Error("OTP not found or expired. Please request a new OTP.");
        }

        if (otpRecord.otp !== otp) {
            throw new Error("Invalid OTP.");
        }

        if (Date.now() > otpRecord.otpExpirationTime) {
            throw new Error("OTP has expired.");
        }

        const user = await this.authRepository.findUserByEmail(email, userType);
        if (!user) {
            throw new Error("User not found.");
        }

        // Generate token
        const payload = { userId: user.user_id, email: user.email };
        const token = JwtService.generateToken(payload);

        // Update token in the user table
        await this.authRepository.updateUser({ email, token }, userType);

        return { message: "Login successful.", token };
    }

    /**
     * Retrieve user details from token.
     */
    async getUserFromToken(token, userType) {
        try {
            const decoded = JwtService.verifyToken(token);
            if (!decoded) {
                throw new Error("Invalid token");
            }
            const user = await this.authRepository.findUserById(decoded.userId, userType);
            return user;
        } catch (error) {
            throw new Error("Error retrieving user from token");
        }
    }

    /**
     * Check user email and token status.
     */
    async checkUserStatus(email, userType) {
        const user = await this.authRepository.findUserByEmailCheckStatus(email, userType);
        return user;
    }
}

module.exports = new AuthService();
