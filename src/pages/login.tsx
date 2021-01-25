import Head from 'next/head';
import axios from 'axios';
import { useState } from 'react';
import { Container, Button, Form, Image } from 'react-bootstrap';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';

interface ILogin {
  userName: string;
  password: string;
}

const initialPayload: ILogin = {
  userName: '',
  password: '',
};

const Login = () => {
  const router = useRouter();

  const [payload, setPayload] = useState<ILogin>(initialPayload);

  const [data, setData] = useState('');

  const handleChange = (e) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };

  const onClickLogin = () => {
    axios
      .post('/api/login', payload)
      .then((res) => {
        setData(res.data.auth);
        if (res.data.auth) {
          // ログインフラグをクッキーへ、「auth」というキーで登録
          setCookie(null, 'auth', 'true', {
            maxAge: 30 * 24 * 60 * 60, // お好きな期限を
            path: '/',
          });
          router.push('/');
        } else {
          console.log('認証エラー')
        }
      })
      .catch((e) => {
        console.log('認証呼び出しエラー');
      });
  };
  return (
    <Container>
      <Head>
        <title>ログイン画面例</title>
      </Head>
      <div className='login-container'>
        <Image
          src='https://placehold.jp/150x150.png'
          roundedCircle
          style={{ marginBottom: '20px' }}
        />
        <Form.Control
          type='text'
          placeholder='User Name'
          name='userName'
          value={payload.userName}
          onChange={handleChange}></Form.Control>
        <Form.Control
          type='password'
          placeholder='Password'
          name='password'
          value={payload.password}
          onChange={handleChange}></Form.Control>
        <p>
          auth:{data}
        </p>
        <Button variant='info' type='button' onClick={onClickLogin}>
          Login
        </Button>
      </div>
    </Container>
  );
};

export default Login;