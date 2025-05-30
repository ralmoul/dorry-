
import { LoginForm } from '@/components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return <LoginForm onSwitchToSignup={() => navigate('/signup')} />;
};

export default Login;
