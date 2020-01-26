/** @type {CanvasRenderingContext2D} */

let canvas
let ctx
let game

let UP    = 38
let RIGHT = 39
let DOWN  = 40
let LEFT  = 37
let PAUSE = 80
let SPACE = 32
let startTime = 0

class Snake{
    constructor(name, startPosX, startPosY){
        this.name = name
        this.x = startPosX
        this.y = startPosY
        this.width = 20
        this.height = 20
        this.direction = 2 // UP=1, RIGHT=2, DOWN=3, LEFT=4
        this.body = [
            {x: this.x, y: this.y, direction: this.direction},
            {x: this.x-this.width, y: this.y, direction: this.direction},
            {x: this.x-this.width*2, y: this.y, direction: this.direction}
        ]
        this.speed = 20
        this.dead = false
    }

    draw(){
        for(let i=0; i < this.body.length; i++){
            let isHead = i == 0
            ctx.fillStyle = isHead ? "green" : "yellow"  //"#34ebd2"
            ctx.fillRect(this.body[i].x, this.body[i].y, this.width, this.height)
        }
    }

    move(keyCode){
        let snakeDirection = this.body[0].direction
        switch(keyCode){
            case UP:
                this.body[0].direction = snakeDirection == 3 ? snakeDirection : 1
                return
            case RIGHT:
                this.body[0].direction = snakeDirection == 4 ? snakeDirection : 2
                return
            case DOWN:
                this.body[0].direction = snakeDirection == 1 ? snakeDirection : 3
                return
            case LEFT:
                this.body[0].direction = snakeDirection == 2 ? snakeDirection : 4
                return
            case PAUSE:
                this.body[0].direction = 5
            case SPACE:
                this.addBody()
        }
    }

    update(){

        this.checkBodyCollision()

        let x = this.body[0].x
        let y = this.body[0].y
        let direction = this.body[0].direction

        switch(direction){
            case 1:
                y -= this.speed
                break
            case 2:
                x += this.speed
                break
            case 3:
                y += this.speed
                break
            case 4:
                x -= this.speed
                break
            case 5:
                x = x
                y = y
                break
        }

        if(x < -20){
            x = canvas.width + this.width
        }
        else if(y < -20){
            y = canvas.height + this.height
        }
        else if(x > canvas.width){
            x = 0
        }
        else if(y > canvas.height){
            y = 0
        }

        let newBody = [{x, y, direction}]
        for(let i=1; i < this.body.length; i++){
            newBody.push(this.body[i-1])
        }
        this.body = newBody
    }

    addBody(){
        let tail = this.body[this.body.length-1]
        let x = tail.x
        let y = tail.y
        let direction = tail.direction
    
        switch(direction){
            case 1:
                y += this.height
                break
            case 2:
                x -= this.width 
                break
            case 3:
                y -= this.height 
                break
            case 4:
                x += this.width
                break
        }
        this.body.push({x, y, direction})
    }

    checkFoodCollision(food){
        if(this.body[0].x < food.x + food.width &&
           this.body[0].x + this.width > food.x &&
           this.body[0].y < food.y + food.height &&
           this.body[0].y + this.height > food.y){
            this.addBody()
            return true
        }
        return false
    }

    checkBodyCollision(){
        for(let i=1; i < this.body.length; i++){
            if(this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y){
                this.dead = true
            }
        }
    }
}

class Food{
    constructor(canvasWidth, canvasHeight){
        this.width = 20
        this.height = 20
        this.x = Math.floor(Math.random() * Math.floor(canvasWidth - this.width))
        this.y = Math.floor(Math.random() * Math.floor(canvasHeight - this.width))
    }

    draw(){
        ctx.fillStyle = "#ffcccc"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class SnakeGame{
    constructor(){
        canvas = document.getElementById("snakeCanvas")
        ctx = canvas.getContext("2d")
        canvas.width = window.innerWidth - 100
        canvas.height = window.innerHeight - 100
        this.snake = new Snake("Sniky", canvas.width/2, canvas.height/2)
        this.food = new Food(canvas.width, canvas.height)
        this.score = 0
        this.draw()
    }

    update(keyCode){
        this.snake.move(keyCode)
        this.snake.update()
    }

    loop(){
        let isFoodEaten = this.snake.checkFoodCollision(this.food)
        if(isFoodEaten){
            this.score++
            this.food = new Food(canvas.width, canvas.height)
        }
        this.update()
        this.draw()
    }

    draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#16516D"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        this.food.draw()
        this.snake.draw()
    }

    gameOver(){
        if(this.snake.dead){
            ctx.font = "30px Arial"
            ctx.fillStyle = "yellow"
            ctx.textAlign = "center"
            ctx.fillText("Game over!", canvas.width/2, canvas.height/2)
            return true
        }
        return false
    }
}

function playGame(){
    game = new SnakeGame()
}

function gameLoop(timestamp){
    startTime++
    if(timestamp - startTime > 50){
        game.loop()
        document.getElementById("score").innerText = game.score
        startTime = timestamp
    }
    if(game.gameOver()){
        return
    }
    window.requestAnimationFrame(gameLoop)
}

function keyPressed(e){
    game.update(e.keyCode)
}

function restart(){
    location.reload()
}

document.addEventListener('DOMContentLoaded', playGame);
window.addEventListener("keydown", keyPressed)
window.requestAnimationFrame(gameLoop);