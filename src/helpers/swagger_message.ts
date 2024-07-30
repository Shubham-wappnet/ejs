export const registerApi = {
  SUMMARY: 'Register new user',
  OK_RESPONSE_DESCRIPTION:
    'Account registration has been successfully completed.',
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'An account has already been registered with the provided email address or identity number.',
  NAME: {
    DESCRIPTION: 'User Name',
    EXAMPLE: 'John Doe',
    FORMAT: 'string',
  },
  EMAIL: {
    DESCRIPTION: 'User Email',
    EXAMPLE: 'abc@mailinator.com',
    FORMAT: 'email',
  },
  PASSWORD: {
    DESCRIPTION: 'User Password',
    EXAMPLE: 'P@ssw0rd',
    FORMAT: 'string',
  },
};

export const loginAPI = {
  SUMMARY: 'Account Login',
  ACCOUNT_SUMMARY: 'User account login by user',
  OK_RESPONSE_DESCRIPTION: 'Login Successful',
  BAD_REQUEST_RESPONSE_DESCRIPTION: 'Inactive Account',
  UNAUTHORIZED_RESPONSE_DESCRIPTION: 'Invalid Credentials',
  EMAIL: {
    DESCRIPTION: 'User Email',
    EXAMPLE: 'john.doe@mailinator.com',
    FORMAT: 'email',
  },
  PASSWORD: {
    DESCRIPTION: 'User Password',
    EXAMPLE: 'P@ssw0rd',
    FORMAT: 'string',
  },
};

export const forgotPasswordApi = {
  SUMMARY: 'User forgot password',
  OK_RESPONSE_DESCRIPTION: 'Forgot password email sent successfully',
  BAD_REQUEST_RESPONSE_DESCRIPTION: 'Account not found with given email',
  TOKEN: {
    NAME: 'token',
    FORMAT: 'string',
    DESCRIPTION: 'token which is get from email',
  },
};

export const resetPasswordApi = {
  SUMMARY: 'Reset password',
  OK_RESPONSE_DESCRIPTION: 'Password reset successfully',
  BAD_REQUEST_RESPONSE_DESCRIPTION:
    'Invalid link, account not found, forgot password request not found',
};
