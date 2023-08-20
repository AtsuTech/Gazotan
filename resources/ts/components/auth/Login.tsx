import { FC } from "react";
import React, { useState} from 'react';
import axios,{AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import {Link,useNavigate} from 'react-router-dom';
import { useCookies } from "react-cookie";




export const Login: FC = () => {
    //ページ遷移で使う
    const navigate = useNavigate();

    interface Login {
        email: string;
        password: string;
    }


    // フォーム入力の値の変数を定義
    const [loginInput, setLogin] = useState<Login>({
        email: '',
        password: '',
    });


    // トークンを保存するクッキーを定義
    const [auth_token, setCookie, removeCookie] = useCookies(["token"]);


    // フォーム入力された値をsetLogin関数で更新
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

        //イベントハンドラが実行された後にオブジェクトのプロパティにアクセスする必要がある場合は、e.persist() を呼ぶ必要がある
        e.persist();

        setLogin({...loginInput, [e.target.name]: e.target.value });
    }

    // フォームのボタンがsubmitされた時に、ログインの処理をする
    const LoginSubmit = (e: any) =>{

        //フォームデータ送信時に画面を再更新しないようにする処理
        e.preventDefault();

        // axiosで送るデータを定義。ここにフォームで入力された値(email,password)が入る。
        const data = {
            email: loginInput.email,
            password: loginInput.password,
        }

        // axiosでログインAPIにemail,passwordをHTTP通信で送る
        axios.post('http://127.0.0.1:8000/api/login', data).then(function (response:AxiosResponse|any){

            // --------送信成功時の処理-------- //
            alert('ログイン成功');

            //トークンをクッキーに保存
            setCookie("token",response.data.access_token);

            // props.setAuth(true);

            //ユーザ名をローカルストレージに保存
            localStorage.setItem('user_name',response.data.user_name);

            //ステータスコードをローカルストレージに保存
            // localStorage.setItem('status',response.status);
            localStorage.setItem('auth_status',response.status);

            //ログイン後の移動先
            navigate("/");

            
        })
        .catch(function (error:AxiosError|any) {
        
            // --------送信失敗時の処理-------- //
            alert(error.response.data.error);
            console.log(error);

        });

    }


    return (
        <div className="block w-1/3 ml-auto mr-auto mt-10 mb-10 p-5 rounded-3xl bg-white text-slate-600">
            <h1 className="w-full text-center text-2xl mt-10 mb-10">ログイン</h1>

            <form onSubmit={LoginSubmit}>
                <div>
                    <p>メールアドレス</p>
                    <input type="email" name="email" 
                        value={loginInput.email}  
                        onChange={handleInput} 
                        className="block w-full h-10 border border-gray-600 rounded"
                        placeholder="メールアドレス"
                    />
                </div>
                <div className="mt-10">
                    <p>パスワード</p>
                    <input type="password" name="password" 
                        value={loginInput.password}  
                        onChange={handleInput}
                        className="w-full h-10 border border-gray-600 rounded"
                        placeholder="パスワード"
                    />
                </div>
                <button type="submit" className="block mt-10 bg-amber-400 w-full h-10 text-white ml-auto mr-auto rounded-lg shadow-lg font-medium text-1xl">ログイン</button>
            </form>

            <Link to="/forgot-password" className="">
                <span className="block w-full text-cyan-500 mt-10">パスワードを忘れた</span>
            </Link>

        </div>
    );
    
}


