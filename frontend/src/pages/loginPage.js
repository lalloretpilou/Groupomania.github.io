import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginPage.css';

const LoginPage = (props) => {

  const [emailSignUp, setEmailSignUp] = React.useState('');
  const [emailLogin, setEmailLogin] = React.useState('');

  const [passwordSignUp, setPasswordSignUp] = React.useState('');
  const [passwordLogin, setPasswordLogin] = React.useState('');

  const navigate = useNavigate();

  const handleSubmitLogin = (e) => {
    e.preventDefault();

    axios({
      method: 'post',
      url: 'http://localhost:4000/api/auth/login',
      data: {
        email: emailLogin,
        password: passwordLogin,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          navigate('/home');
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userId', res.data.userId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitSignup = (e) => {
    e.preventDefault();

    axios({
      method: 'post',
      url: 'http://localhost:4000/api/auth/signup',
      data: {
        email: emailSignUp,
        password: passwordSignUp,
      },
    })
      .then((res) => {
        if (res.status === 201) {
          console.log(res);
          navigate('/home');
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userId', res.data.userId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="ConnectionDivision">
        <div className="loginDivision">
          <p className="titleConnection"> &gt; Se connecter</p>
          <form onSubmit={handleSubmitLogin} className="form">
            <label className="formText">
              <input
                className="input"
                type="text"
                placeholder="Email"
                id="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                tabIndex="1"
              />
            </label>
            <label className="formText">
              <input
                className="input"
                type="password"
                placeholder="Mot de passe"
                id="password"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                tabIndex="2"
              />
            </label>
            <input
              type="submit"
              value="Se connecter"
              className="button login__submit"
              tabIndex="3"
            />
          </form>
        </div>
        <div className="signUpDivision">
          <p className="titleConnection"> &gt; Créer un compte</p>
          <form onSubmit={handleSubmitSignup} className="form">
            <label className="formText">
              <input
                className="input-container"
                type="text"
                placeholder="Email"
                id="email"
                value={emailSignUp}
                onChange={(e) => setEmailSignUp(e.target.value)}
                tabIndex="4"
              />
            </label>
            <label className="formText">
              <input
                className="input"
                placeholder="Mot de passe"
                type="password"
                id="password"
                value={passwordSignUp}
                onChange={(e) => setPasswordSignUp(e.target.value)}
                tabIndex="5"
              />
            </label>
            <input
              type="submit"
              value="S'inscrire"
              className="button login__submit"
              tabIndex="6"
            />
          </form>
        </div>
      </div>
    </>
  );
}

LoginPage.propTypes = {};

export default LoginPage;
