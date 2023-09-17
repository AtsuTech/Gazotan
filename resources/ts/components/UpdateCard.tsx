import { FC } from "react";
import { useParams } from 'react-router-dom';
import { useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import axios,{AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import { UpdateCardImage } from "./UpdateCardImage";


export const UpdateCard:FC = () => {

    //URLからパラメータを取得
    const { card_id } = useParams();

    const [card,setCard] = useState({
        card_id:'',
        word:'',
        word_mean:'',
        sentence:'',
        sentence_mean:'',
        memory:'',
        part_of_speech:'',
        flashcard_title:'',
        flashcard_id:'',
    });

    document.title = '編集:'+card.word;

    //品詞のselectチェック用のパラメータを設定
    const [selected,setSelected] = useState<any>();

    // パラメータ(暗号化されたid)付きでアクセスし、該当データをDBより取得
    useEffect(()=>{

        axios.get('/api/card/' + card_id).then((response) => { 
            console.log(response);
            
            setCard({
                card_id:response.data.id_encrypt,
                word : response.data.word,
                word_mean : response.data.word_mean,
                sentence : response.data.sentence,
                sentence_mean : response.data.sentence_mean,
                memory : response.data.memory,
                part_of_speech : response.data.part_of_speech,
                flashcard_title:response.data.flashcard.title,
                flashcard_id:response.data.flashcard.id_encrypt,
            });

            //品詞のselectチェックの初期値を設定
            setSelected(response.data.part_of_speech_id);

        }).catch((error) => { 
            console.log(error);
        
        });
    },[]);


    //品詞の変数を取得
    const [getSelectItems,setGetSelectItems] = useState<any>([]);
    
    //DBより品詞のリストを取得
    useEffect(()=>{

        axios.get('/api/part_of_speeches').then((response) => { 
            setGetSelectItems(response.data);
        }).catch((error) => { 
            console.log(error);
        });
    
    },[]);



    //フォーム入力項目をcardにセット
    const handleInput =(e:any)=>{
        e.persist();
        setCard({...card, [e.target.name]: e.target.value }); 
        
    }


    //Submitボタンで更新データ送信処置
    const UpdateSubmit =(e:any)=>{
        e.preventDefault();
        
        //axios通信で渡すクエリパラメータ
        const params = new FormData();
        params.append('card_id',card.card_id);
        params.append('part_of_speech_id',selected);
        params.append('word',card.word);
        params.append('word_mean',card.word_mean);
        params.append('sentence',card.sentence);
        params.append('sentence_mean',card.sentence_mean);
        
        //DBにデータ送る
        axios.post('/api/card/update', params).then(function (response: AxiosResponse<Response>) {

            // 送信成功時の処理
            alert('保存しました');

            
        })
        .catch(function (error:undefined|any) {

            // 送信失敗時の処理
            alert('失敗しました。');
            console.log(error);
            
        });
    }

    

    return (
        <section>
            
            <h5 className="text-3xl">カード編集</h5>

            <div>
                <Link to={`/flashcard/${card.flashcard_id}`}><span>単語帳:{card.flashcard_title}</span></Link>/
                <Link to=""><span>単語:{card.word}</span></Link>
            </div>

            <UpdateCardImage id={card_id} />

            <form onSubmit={UpdateSubmit}>

                <input type="text" 
                    name="word" 
                    className="w-full h-10 border border-gray-300 rounded pl-2" 
                    placeholder="単語 ex.)Apple" 
                    value={card.word}
                    onChange={handleInput} 
                    required
                />

                <div className="flex">

                    <select name="part_of_speech_id" value={selected} onChange={(e:any) => setSelected(e.target.value)}>
                        {getSelectItems.map( (getSelectItem:any) => (
                            <option key={getSelectItem.item} value={getSelectItem.id}>{getSelectItem.item}</option>
                        ))}    
                    </select>

                    <input type="text" 
                        name="word_mean" 
                        className="w-full h-10 border border-gray-300 rounded pl-2" 
                        placeholder="訳 ex.)りんご" 
                        value={card.word_mean}
                        onChange={handleInput} 
                        required
                    />
                    
                </div>
                
                <textarea 
                    name="sentence" 
                    rows={5} 
                    className="w-full p-2 border border-gray-300" 
                    defaultValue={card.sentence}
                    onChange={handleInput} 
                    placeholder="例文:Apple is red and delicious fruits."
                    >
                </textarea>

                <textarea 
                    name="sentence_mean" 
                    rows={5} 
                    className="w-full p-2 border border-gray-300" 
                    defaultValue={card.sentence_mean}
                    onChange={handleInput} 
                    placeholder="例文(訳):りんごは赤くて美味しい果物です。"
                    >
                </textarea>

                <button type="submit" className="block mr-0 bg-blue-400 w-36 h-10 text-white ml-auto mr-auto rounded-lg font-medium text-1xl">
                    更新
                </button>
            </form>
        </section>
    );
}