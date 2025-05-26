
import { SignupForm } from '@/components/auth/SignupForm';

const Signup = () => {
  return <SignupForm onSwitchToLogin={() => window.location.href = '/login'} />;
};

export default Signup;
