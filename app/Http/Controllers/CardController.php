<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Card;
use Illuminate\Support\Facades\Auth; // Authファサードを読み込む
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Support\Facades\Storage;

class CardController extends Controller
{
    //新規追加
    public function create(Request $request){
        $Card = new Card;

        $Card->flashcard_id = decrypt($request->flashcard_id);
        $Card->user_id = Auth::id();

        $image = $request->file('image');
        if($image != null){
            $path = $image->store('public/images');
            $Card->img_path = basename($path);
        }elseif($image == null){
            $Card->img_path = null;
        }
       

        $Card->category_id = $request->integer('category_id');
        $Card->word = $request->word;
        $Card->word_mean = $request->word_mean;

        if($request->sentence == null||$request->sentence ==""){
            $Card->sentence = "";
        }else{
            $Card->sentence = $request->sentence;
        }

        if($request->sentence_mean == null||$request->sentence_mean ==""){
            $Card->sentence_mean = "";
        }else{
            $Card->sentence_mean = $request->sentence_mean;
        }
        
        $Card->memory = false;

        $Card->save();
    }

    //詳細画面
    function public_detail_card($id){

        //暗号化したidをデコード
        $id = decrypt($id);
        
        //デコードしたidで検索
        $card = Card::with(['flashcard'])->findOrFail($id);

        $access = $card->flashcard->access->type;
        if($access == 0){
            return response()->json(['message' => '非公開のカードです']);
        }elseif($access == 1){
            return response()->json($card);
        }

    }

    //編集
    public function update(Request $request){
        $Card = Card::find(decrypt($request->card_id));

        $Card->category_id = $request->integer('category_id');
        $Card->word = $request->word;
        $Card->word_mean = $request->word_mean;
        $Card->sentence = $request->sentence;
        $Card->sentence_mean = $request->sentence_mean;
        $Card->link = $request->link;
 
        $Card->save();
    }

    //画像のみ編集
    public function update_only_image(Request $request){
        $Card = Card::find(decrypt($request->card_id));

        $image = $request->file('image');
        if($image != null){
            $path = $image->store('public/images');
            $Card->img_path = basename($path);
        }elseif($image == null){
            $Card->img_path = null;
        }

        $Card->save();

    }

    //画像削除
    public function delete_image(Request $request){
        $Card = Card::find(decrypt($request->card_id));
        $Card->img_path = null;
        Storage::disk('public')->delete('images/' . $request->img_path);
        $Card->save();
    }


    //カード削除
    public function delete(Request $request){
        $Card = Card::find(decrypt($request->card_id));
        Storage::disk('public')->delete('images/' . $Card->img_path);
        $Card = Card::find(decrypt($request->card_id))->delete();
    }

}
