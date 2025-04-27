// TODO 
// ボタンでの起動，停止機構
// 初期値の操作性の向上(特定のエリアだけ初期生成する，など)

width = 600
height = 600
size = 200
// サイズをデカくしたら，ショットガンみたいな(もとい，グライダーガンみたいな)
// 特殊なコンポーネントが見られる可能性とか上がるんだろうか

canvas = null
ctx = null

let field = []
let nextfield = []

// 番兵の便利さを今回は思い知った
// 逆にこれ使わずにオセロとかどうやって書くんだよってかんじ
// 再帰でオセロを書きたいと数万回述べている
const clear = () => {
    for (let y = 0; y < size + 2; y++) {
        field[y] = []
        nextfield[y] = []
        for (let x = 0; x < size + 2; x++) {
            field[y][x] = 0
            nextfield[y][x] = 0
        }
    }
}

const random = () => {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            field[y][x] = Math.random() > 0.8 ? 1 : 0
            // グライダーは思ったよりもたくさん生成されてる
            // やはり 0.8 くらいが適度な塩梅な模様
            // 0.95 にすると流石に初期から死にすぎている
            // というかこれもスライダーで，最初の生成量を調整できるようにすればいいんじゃって話で
            // ただ，start と stop の実装も付随してくるのでちょっとめんどくさいのでパスしちゃお！
            // （だから成長しないんだよなあ，ほんとにカス）
            // あと，最初のランダム模様を生成した後，しばらくその状態で止まっていて欲しい
            // grid を表示して，各ピクセルで，気に入らんやつを編集したりできるとさらに面白そう
            // つまるところ，ゲノム編集ってわけ（？）
        }
    }
}

const render = () => {
    for (let y = 1; y < size+1; y++) {
        for (let x = 1; x < size+1; x++) {
            if (field[y][x]) {
                ctx.fillStyle = '#0f0'
            } else {
                ctx.fillStyle = '#000'
            }
            ctx.fillRect(x * width / size, y * height / size, width / size, height / size)
        }
    }
}

const step = () => {
    for (let y = 1; y <=  size; y++) {
        for (let x = 1; x <= size; x++) {
            let lifeCount = 0
            for (let dy = -1; dy < 2; dy++) {
                for (let dx = -1; dx < 2; dx++) {
                    if (field[y + dy][x + dx]) {
                        //console.log('survive');
                        lifeCount++
                        // 生命体自体のカウントはできるんだろうかという感じがする
                    }
                }
            }
            // ここの生成ルールは少しいじると途端に生命はすぐ死んでしまう
            // 自分が生きてて周りが 2 or 3 生きてたら自分も生き続けるというルールだが，
            // ここは自分自身のことも数えているので，3,4 となっていることに留意したい
            if ((field[y][x] && (lifeCount === 3 || lifeCount === 4)) ||
                (!field[y][x] && lifeCount === 3)) {
                //console.log('survive!!');
                nextfield[y][x] = 1
            } else {
                nextfield[y][x] = 0
            }
        }
    }
    // この書き方だと，めちゃくちゃ重くなる，なぜか
    //[field, nextfield] = [nextfield, field]
    // 謎に async を使ってるのが問題説？t-kihira との違いってそこくらいじゃ？と思ってる
    // まあでも冷静に考えて，async って関数が止まるという性質を付与するだけなので，
    // 別にそのせいで動作が重くなるとかはあんまり考えづらいというか
    // async をつけて宣言するって．実際やってることとしては大したことやってないような気がして
    // 途中で止まれるようになんかしらのフックみたいなのをつけるだけとか，
    // 多分その程度のことしかやっていないような気がする
    // Rust コンパイラの本でコルーチンを実装してたので，その辺をやってみるとよくわかると思うけど
    // 大体，コルーチンと async と，generator の違いもよくわからんしという話はある
    // remdis の generator が実際何をやってるのかをきちんと理解したいという気持ちがある
    // しかし，ライフゲームはなかなかにキモくて素晴らしいな
    let buf = field
    field = nextfield
    nextfield = buf
}

const init = () => {
    canvas = document.getElementById('canvas')
    canvas.width = width
    canvas.height = height
    ctx = canvas.getContext('2d')
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    clear()
    random()
    render()
}

window.onload = async () => {
    init()
    // while(true){
    //     render()
    //     step()
    //     await new Promise(r => setTimeout(r, 100))
    // }
    const tick = () => {
        setTimeout(tick, 100)
        step()
        render()
    } 
    tick()
}
