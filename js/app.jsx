class App extends React.Component{
    
    constructor(props){
        super(props);    
                                
        this.state={
                userField: [],
                compField: [],
                userKill: 0,
                compKill: 0,
                isDame: false,
                xDame: 0,
                yDame: 0
        };
    }
    
    
    componentDidMount() {
        this.start();
    }
    
    
    render(){
    
        var isEnd = (this.state.userKill == 10 || this.state.compKill == 10);
    
        return (
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h1><p className="text-center text-primary">Компьютер {this.state.compKill == 10 ? "(выиграл)":""}</p></h1>
                            <Field field={this.state.compField} head="Компьютер" isUser={false} shot={(e) => this.shotEvent(e)}/>
                        </div>
                        <div className="col-md-6">
                            <h1><p className="text-center text-primary">Игрок {this.state.userKill == 10 ? "(выиграл)":""}</p></h1>
                            <Field field={this.state.userField}  head="Игрок" isUser={true} />
                        </div>
                    </div> 
                    <div className="row">
                        <div className="col-md-12">
                            <h2>
                                <button className="btn btn-primary center-block btn-lg" onClick={() => this.start()}>{isEnd ? "Новая игра" : "Сдаться"}</button>
                            </h2>
                        </div>
                    </div>
                </div>
        );
    }     
    
    
    start(){
        
        var userField = [];
        var compField = [];
        
        for(var i = 0; i < 11; i++){
            
            userField[i] = [];
            compField[i] = [];
            
            for(var j = 0; j < 11; j++){
                
                if(i == 0 && j > 0){
                    
                    var alpha = String.fromCharCode(64 + j);
                    
                    userField[i][j] = alpha;
                    compField[i][j] = alpha;
                    continue;
                }
                
                if(j == 0 && i > 0){
                    userField[i][j] = i;
                    compField[i][j] = i;
                    continue;
                }
                
                if(i == 0 && j == 0){
                    userField[i][j] = "";
                    compField[i][j] = "";
                    continue;
                }
                
                userField[i][j] = 0;
                compField[i][j] = 0;                
            }
        }
        
        this.createShips(userField);
        this.createShips(compField);
        
        this.setState({
            userField: userField,
            compField: compField,
            userKill: 0,
            compKill:0,
            isDame: false,
            xDame: 0,
            yDame: 0
        });       
    }
    
    
    createShips(field){
                
        for(var long = 4; long > 0; long--){
                                    
            for(var count = 0; count < 5 - long; count++){
               
                this.createShip(field, long);
            }            
        }
    }
    
    
    createShip(field, long){
        
        while(true){
            
            var dx = 0;
            var dy = 0;
            var x = Math.floor(Math.random() * 10);
            var y = Math.floor(Math.random() * 10); 
            var direct = Math.floor(Math.random() * 4);
            
            switch(direct){
                case 0:
                    dx = 1; dy=0;
                    break;
                case 1:
                    dx = 0; dy=1;
                    break;
                case 2:
                    dx = -1; dy=0;
                    break;
                case 3:
                    dx = 0; dy=-1;
                    break;                    
            }         
            
            var success = true;
            
            for(var j = 0; j < long; j++){
              
                var newX = x + dx * j + 1;
                var newY = y + dy * j + 1;
                
                if(newY < 1 || newX < 1 || newY > 10 || newX > 10){
                    success = false;
                    break;
                }
                
                if(field[newY][newX] != 0){
                    success = false;
                    break;
                }                    
            }
            
            if(!success){
                continue;
            }
            
            for(var j = 0; j < long; j++){
                
                var newX = x + dx * j + 1;
                var newY = y + dy * j + 1;
                
                field[newY][newX] = long;  
                this.arround(field, newX, newY);
            }
                                                    
            break;
        }
    }
    
    
    arround(field, x, y){
        
        for(var i = -1; i < 2; i++){
            for(var j = -1; j < 2; j++){
                
                 var newY = y + i;
                 var newX = x + j;
                 
                 if(newY < 1 || newX < 1 || newY > 10 || newX > 10){
                     continue;
                 }
                 
                 if(field[newY][newX] == 0){
                     field[newY][newX] = -1;
                 }
            }
        }
    }
    
    
    shotEvent(e){
        
        var x = Number(e.target.attributes.x.value);
        var y = Number(e.target.attributes.y.value);
        
        if(x < 1 || y < 1){
            return;
        }
        
        //console.log("x=" + x + "; y=" + y);
        
        const compField = this.state.compField.slice();
        var userKill = this.state.userKill;
        var compKill = this.state.compKill;
        
        if(userKill == 10 || compKill == 10){
            return;
        }
        
        userKill += this.shot(compField, x, y);                 
        
        this.setState({compField: compField, userKill: userKill}); 
        
        
        //Стреляет комп
        const userField = this.state.userField.slice(); 
        var isDame = this.state.isDame;
        var xDame = this.state.xDame;
        var yDame = this.state.yDame;
        
        if(!isDame){//Если не ранен, стреляем случайно
            while(true){
                x = Math.floor(Math.random() * 10) + 1;
                y = Math.floor(Math.random() * 10) + 1;
                
                if(userField[y][x] > -2 && userField[y][x] < 5){
                    break;
                }
            }
        }else{//Если ранен, добиваем не честно
            
            var count = userField[yDame][xDame] - 7;
            
            for(var i = 1; i < 11; i++){
                for(var j = 1; j < 11; j++){
                    
                    if(userField[i][j] == count){
                        //Ищем рядом раненых
                        var dame = count + 7;
                        var success = false;
                        
                        for(var n = -1; n < 2; n++){
                            for(var k = -1; k < 2; k++){
                                if(!this.isValid(j + k, i + n) || (n == 0 && k == 0)){
                                    continue;
                                }
                                if(userField[i + n][j + k] == dame){
                                    success = true;
                                    break;
                                }
                            }
                        }
                        
                        if(success){
                            x = j;
                            y = i;
                            break;
                        }
                    }
                }
            }
        }        
        
        isDame = false;
        if(userField[y][x] > 1 && userField[y][x] < 5){
            isDame = true;
            xDame = x;
            yDame = y;
        }
        
        var kill = this.shot(userField, x, y);
        
        if(kill == 1){
            isDame = false;
            compKill += kill;
        }
        
        this.setState({userField: userField, 
                       compKill: compKill, 
                       isDame: isDame, 
                       xDame: xDame, 
                       yDame: yDame});  
        
        
    }
    
    
    shot(field, x, y){
                        
        if(field[y][x] < 6 && field[y][x] != -2){       
            
            field[y][x] += 7;      
            
            
            if(this.testKill(field, x, y)){
                return 1;
            }
        }
        
        return 0;
    }
    
    
    testKill(field, x, y){
        
        var direct = -1; 
        var dy = 0;
        
        var count = field[y][x] - 7;
        
        if(count < 1 || count > 4){
            return false;
        }
        
        if(this.isShip(count, field, x - 1, y) || this.isShip(count, field, x + 1, y)){
            
            direct = 0; //горизонтально
        }
        else if(this.isShip(count, field, x, y - 1) || this.isShip(count, field, x, y + 1)){
            
            direct = 1; //вертикально
        }
        
        if(direct == -1){//однопалубный убит
            
            field[y][x] += 7;
            this.arroundKill(field, x, y);
            return true;
        }
        
        if(direct == 0){
            
            //var isKill = true;
            var dx = 0;
            
            while(this.isShip(count, field, x + dx, y)){//идем влево
                
                if(field[y][x + dx] == count){
                    
                    return false;
                }
                
                dx--;
            }
            
            dx = 0;
            while(this.isShip(count, field, x + dx, y)){//идем вправо
                
                if(field[y][x + dx] == count){
                    
                    return false;
                }
                
                dx++;
            }
            
            dx = 0;
            while(field[y][x + dx] == count + 7){//идем влево
                
                field[y][x + dx] += 7;
                this.arroundKill(field, x + dx, y);
                
                dx--;
            }
            
            dx = 1;
            while(field[y][x + dx] == count + 7){//идем вправо
                
                field[y][x + dx] +=7;
                this.arroundKill(field, x + dx, y);
                
                dx++;
            }
            
            return true;
        }
        else{ //вертикально
            
            var dy = 0;
            
            while(this.isShip(count, field, x, y + dy)){//идем вверх
                
                if(field[y + dy][x] == count){
                    
                    return false;
                }
                
                dy--;
            }
            
            dy = 0;
            while(this.isShip(count, field, x, y + dy)){//идем вниз
                
                if(field[y + dy][x] == count){
                    
                    return false;
                }
                
                dy++;
            }
            
            dy = 0;
            while(this.isValid(x, y + dy) && field[y + dy][x] == count + 7){//идем влево
                
                field[y + dy][x] += 7;
                this.arroundKill(field, x, y + dy)
                
                dy--;
            }
            
            dy = 1;
            while(this.isValid(x, y + dy) && field[y + dy][x] == count + 7){//идем вправо
                
                field[y + dy][x] +=7;
                this.arroundKill(field, x, y + dy)
                
                dy++;
            }
            
            return true;
        }
        
    }
    
    isShip(count, field, x, y){
     
        if(!this.isValid(x, y)){
            return false;
        }
        
        var value = field[y][x];
        
        if(value == count || value == count + 7){
            return true;
        }
        
        return false;
    }
    
    
    arroundKill(field, x, y){
    
        for(var i = -1; i < 2; i++){
            for(var j = -1; j < 2; j++){
                
                 var newY = y + i;
                 var newX = x + j;
                 
                 if(newY < 1 || newX < 1 || newY > 10 || newX > 10){
                     continue;
                 }
                 
                 if(field[newY][newX] == -1){
                     field[newY][newX] = -2;
                 }
            }
        }
    }
    
    isValid(x, y){
        
        if(x > 0 && x < 11 && y > 0 && y < 11){
            return true;
        }
        
        return false;
    }
}


class Field extends React.Component{
    constructor(props){
        super(props);
    }
    

    /**
     * Отрисовка элемента поля
     */
    renderCol(el, y){
        
        return(         
                el.map(function(el, x){
                    
                    var className = "";
                    var value = el;
                                                            
                    if(!(y == 0 && x == 0)){
                        
                        if(el > 0){
                            className = this.props.isUser ? "ship" : "";                            
                        }
                        
                        if(!this.props.isUser){
                            className = "gun";
                        }
                            
                        if(el > 14){
                            className = "killShip";
                        }
                        else if(el > 7){
                            className = "dameShip";
                        }
                        else if(el > 5){
                            className = "bomb";
                        }
                        else if(el == -2){
                            className = "nearKill";
                        }                            
                                                
                    }                        
                                        
                    if(y == 0){
                        className = "topHead";
                        value = el;
                    }
                    
                    if(x == 0){
                        className = "leftHead";
                        value = el;
                    }
                    
                    if(y == 0 && x == 0){
                        className = "noBorder";
                    }
                    
                    return <td key={x} x={x} y={y} className={className} onClick={this.props.isUser ? "": (e) => this.props.shot(e)}></td>;
                    }.bind(this))
            );
    }
    
    /**
     * Отрисовка компонента
     */
    render(){
        
        return (
                <table className="field">
                    <tbody>
                    {
                        this.props.field.map(function(el, index){                           
                            return <tr key={index}>{this.renderCol(el, index)}</tr>;
                            }.bind(this))
                    }               
                    </tbody>
                </table>
        );
    }
}


ReactDOM.render(
        <App />,
        document.getElementById("app")
    );