import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';

export default function Register() {
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validLogin, setValidLogin] = useState(false);
  const [loginWarning, setLoginWarning] = useState({});
  const navigate = useNavigate();

  // função que faz a validação dos inputs de name, email e senha e salva no estado
  const ValidateLogin = () => {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const validEmail = emailPattern.test(email);
    const FIVE = 5;
    const ELEVEN = 11;

    setValidLogin(name.length > ELEVEN && validEmail && password.length > FIVE);
  };

  const handleLogin = async () => {
    const data = { name, email, password };
    try {
      const response = await axios.post('http://localhost:3001/register', data);
      if ('message' in response) return setLoginWarning(response.data);
      setUser(response.data);
      // Após cadastro o usuário faz login automático e é redirecionado
      navigate('/customer/products');
    } catch (error) {
      console.error('Error:', error.message);
      setLoginWarning({ message: error.message });
    }
  };

  // Chama função de validação sempre que o name, Email ou Senha são alterados
  useEffect(() => {
    ValidateLogin();
  }, [name, email, password]);

  return (
    <div>
      <h1>Cadastro</h1>
      <form>
        <label htmlFor="register_name">
          <input
            type="text"
            data-testid="common_register__input-name"
            id="register_name"
            placeholder="Seu nome"
            value={ name }
            onChange={ ({ target }) => setName(target.value) }
          />
        </label>

        <label htmlFor="register_email">
          <input
            type="text"
            data-testid="common_register__input-email"
            id="register_email"
            placeholder="seu-email@site.com"
            value={ email }
            onChange={ ({ target }) => setEmail(target.value) }
          />
        </label>

        <label htmlFor="register_password">
          <input
            type="password"
            data-testid="common_register__input-password"
            id="register_password"
            placeholder="********"
            value={ password }
            onChange={ ({ target }) => setPassword(target.value) }
          />
        </label>

        <button
          type="button"
          disabled={ !validLogin }
          data-testid="common_register__button-register"
          onClick={ handleLogin }
        >
          CADASTRAR
        </button>

        <p
          className={ `login-error ${!('message' in loginWarning) && 'hidden'}` }
          data-testid="common_register__element-invalid_register"
        >
          {loginWarning.message}
        </p>
      </form>
    </div>
  );
}
