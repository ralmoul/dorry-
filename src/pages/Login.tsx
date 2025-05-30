
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return <LoginForm onSwitchToSignup={() => window.location.href = '/signup'} />;
};

export default Login;
