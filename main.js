width = 300
height = 300
size = 100

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
                    }
                }
            }
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
