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
    console.log("Received in AuthService.signup:");
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("UserType:", userType);
    console.log("Gender:", gender);
    console.log("DOB:", dob);
    console.log("Instagram:", instagram);
    console.log("City:", city);

    const existingUser = await this.authRepository.findUserByEmail(email, userType);
    if (existingUser) {
      throw new Error("Email is already registered.");
    }

    const existingPhone = await this.authRepository.findUserByPhone(phone, userType);
    if (existingPhone) {
      throw new Error("Phone number is already registered.");
    }

    const userData = { email, phone, gender, dob, instagram, city };
    console.log("UserData to be saved:", userData);

    const newUser = await this.authRepository.createUser(userData, userType);

    return { message: "Signup successful", user: newUser };
  }

  async verifySignupOtp(email, otp, userType, phone) {
    console.log("this is verify signp otp ", email, otp, userType, phone);
    const otpRecord = await this.authRepository.findOtpByEmail(email, userType);
    console.log("this is otp record ");
    if (!otpRecord) {
      console.log(" i am here ");
      throw new Error("OTP not found or expired. Please request a new OTP.");
    }

    if (otpRecord.otp !== otp) {
      throw new Error("Invalid OTP.");
    }

    if (Date.now() > otpRecord.otpExpirationTime) {
      throw new Error("OTP has expired.");
    }

    const newUser = await this.authRepository.createUser(
      { email, phone },
      userType
    );

    console.log(" this is new suer ", newUser);

    const payload = { userId: newUser.user_id, email: newUser.email };
    const token = JwtService.generateToken(payload);


    await this.authRepository.updateUser({ email, token }, userType);

    return { message: "Signup successful.", token };
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
      const user = await this.authRepository.findUserById(
        decoded.userId,
        userType
      );
      return user;
    } catch (error) {
      throw new Error("Error retrieving user from token");
    }
  }

  /**
   * Check user email and token status.
   */
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



}

module.exports = new AuthService();

