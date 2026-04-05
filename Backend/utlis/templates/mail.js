const otpTemplate = (otp) => {
  return `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 20px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      
      <div style="background-color: #2c3e50; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 1px;">Team Deep-X</h1>
      </div>
      
      <div style="padding: 40px 30px;">
        <h2 style="color: #333333; margin-top: 0; font-size: 22px; font-weight: 600;">Verify Your Account</h2>
        
        <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
          Your OTP for verification is:
        </p>
        
        <div style="text-align: center; margin: 35px 0;">
          <div style="
            font-family: 'Courier New', Courier, monospace;
            font-size: 34px;
            font-weight: bold;
            letter-spacing: 12px;
            color: #2c3e50;
            background: #f8f9fa;
            padding: 15px 15px 15px 27px; /* Extra left padding balances the letter spacing */
            display: inline-block;
            border-radius: 8px;
            border: 2px dashed #cbd5e1;
          ">
            ${otp}
          </div>
        </div>

        <p style="color: #555555; font-size: 15px; line-height: 1.6;">
          This OTP is valid for <b style="color: #e74c3c;">5 minutes</b>.
        </p>

        <p style="color: #888888; font-size: 14px; line-height: 1.6; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px;">
          If you didn’t request this, please ignore this email.
        </p>
      </div>
      
    </div>
  </div>
  `;
};

export default otpTemplate;