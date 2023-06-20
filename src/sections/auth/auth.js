import { post } from 'src/services/users/usersService';

export const login = async (email, password) => {
  const data = { email, password };
  try {
    const result = await post('auth/login', data);
    localStorage.setItem('company-id', result.companyId);
    localStorage.setItem('accessToken', result.access_token);
    localStorage.setItem('role', result.role);
    localStorage.setItem('email', email);
    await Promise.resolve();
    return { result };
  } catch (error) {
    return { success: false, error };
  }
};
export const register = async (name, email, password, company) => {
  const data = { name, email, password, company };
  const result = await post('auth/register', data);
  if (!result.error){
    try {
      const loginResult = await login(email, password);
      await Promise.resolve();
      return { loginResult };
    } catch (error) {
      return error;
    }
  }
  else{
    return { error: "Error when registering user", statusCode: 427}
  }
   
};
