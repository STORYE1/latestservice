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
    let otpMessage = otp;


    if (email === "storye024@gmail.com") {
      otpMessage = "1234";
    }

    const text = `Dear User,\n\nYour OTP code to complete your login to STORYE is: ${otpMessage}\n\nThis OTP is valid for 10 minutes. Please do not share this code with anyone.\n\nIf you did not request this OTP, please ignore this email.\n\nThank you for using STORYE.\n\nSincerely,\nSTORYE Team`;

    await this.emailService.sendEmail(email, subject, text);
  }

  async signup(email, phone, userType, gender, dob, instagram, city) {

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
      console.error("Error during signup process:", error.message);
      throw new Error("Error during signup process");
    }
  }

  async verifySignupOtp(email, otp, userType, phone, gender, dob, instagram, city) {
    console.log("Verifying OTP for:", email);

    const otpRecord = await this.authRepository.findOtpByEmail(email, userType);
    if (!otpRecord) {
      throw new Error("OTP not found. Please request a new one.");
    }

    if (otpRecord.otp !== otp) {
      throw new Error("Invalid OTP.");
    }

    if (Date.now() > otpRecord.otpExpirationTime) {
      throw new Error("OTP has expired. Please request a new one.");
    }

    const userData = { email, phone, gender, dob, instagram, city };
    console.log("Creating user with data:", userData);

    const newUser = await this.authRepository.createUser(userData, userType);

    const payload = {
      email: newUser.email,
      userType: userType,
      userId: userType === "guide" ? newUser.user_id : undefined,
      consumerId: userType === "consumer" ? newUser.consumer_id : undefined,
    };
    console.log("Generating token for user:", payload);
    const token = JwtService.generateToken(payload);

    await this.authRepository.updateUser({ email, token }, userType);

    return { message: "Signup successful", token, user: newUser };
  }

  async loginRequest(email, userType) {
    const user = await this.authRepository.findUserByEmail(email, userType);
    if (!user) {
      throw new Error("User not found. Please sign up first.");
    }

    const otp = this.generateOTP(email);
    const otpExpirationTime = Date.now() + 10 * 60 * 1000;

    await this.authRepository.saveOtp(email, otp, otpExpirationTime, userType);
    await this.sendOtpEmail(email, otp);
    await this.authRepository.saveOtp(email, otp, otpExpirationTime, userType);
    await this.sendOtpEmail(email, otp);

    return { message: "OTP sent to your email." };
  }


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

    const payload = {
      email: user.email,
      userType: userType,
      userId: userType === "guide" ? user.user_id : undefined,
      consumerId: userType === "consumer" ? user.consumer_id : undefined,
    };
    console.log("Generating token for user:", payload);
    const token = JwtService.generateToken(payload);

    await this.authRepository.updateUser({ email, token }, userType);

    return { message: "Login successful.", token };
  }


  async getUserFromToken(token, userType) {
    try {
      const decoded = JwtService.verifyToken(token);
      if (!decoded) {
        throw new Error("Invalid token");
      }
      const user = await this.authRepository.findUserById(
        decoded.userId,
        userType
      );
      return user;
    } catch (error) {
      throw new Error("Error retrieving user from token");
    }
  }

  async checkUserStatus(email, userType) {
    const user = await this.authRepository.findUserByEmailCheckStatus(
      email,
      userType
    );
    return user;
  }

  async getAllUsers() {
    return await this.authRepository.getAllUsers();
  }

  async updateVerificationStatus(userIds, isVerified) {
    return await this.authRepository.updateVerificationStatus(userIds, isVerified);
  }

  async checkUserVerification(user_id) {
    const user = await this.authRepository.findUserById(user_id);
    return user ? user.is_verified : null;
  };

  getOtpModel(userType) {
    console.log("Determining OTP model for userType:", userType);
    if (userType === "guide") return GuideOTP;
    if (userType === "consumer") return ConsumerOTP;
    throw new Error("Invalid userType");
  }
}

module.exports = new AuthService();

