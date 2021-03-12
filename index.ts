// Класс, описывающий координаты в 3-х мерном пространстве
class Coord
{
    constructor(xCoord:number=0,yCoord:number=0,zCoord:number=0)
    {
        this._xCoord=xCoord;
        this._yCoord=yCoord;
        this._zCoord=zCoord;
    }

    get xCoord():number
    {
        return this._xCoord;
    }
    get yCoord():number
    {
        return this._yCoord;
    }
    get zCoord():number
    {
        return this._zCoord;
    }
    plusCoord(xCoord:number=0,yCoord:number=0,zCoord:number=0):void
    {
        this._xCoord+=xCoord; this._yCoord+=yCoord; 
        this._zCoord+=zCoord;
    }
    clearCoord():void
    {
        this._xCoord=0; this._yCoord=0; this._zCoord=0;
    }
    private _xCoord:number;
    private _yCoord:number;
    private _zCoord:number;
}

// Класс спрайтов. Предполагается, что спрайты занимают значительное место в памяти
class Sprite
{
    constructor(name:string)
    {
        this._name=name;
    }
    drawSprite(pos:Coord,color:Color):void
    {
        console.log(`sprite ${this._name} with ${Color[color]} color rendered`);
    }

    private _name:String;
}

// перечисление возможных размеров оскольков
enum SizeOfFragment
{
    SMALL=0,
    MEDIUM=1,
    LARGE=2,
}

// перечисление возможных цветов
enum Color
{
    RED=0,
    GREEN=1,
    BLUE=2,
}

// Класс Пули. Разрушение пули создает множество осколков
class Bullet
{
    constructor(pos:Coord,direction:Coord,speed:number,energy:number)
    {
        this._pos=Object.assign({},pos); this._direction=Object.assign({},direction); 
        this._energy=energy; this._speed=speed;
    }
    move():void
    {
        this.changeCoordAndDir();
        --this._energy;
    }
    destruction():BulletFragments
    {
        return new BulletFragments(this._pos,this._energy);
    }
    private changeCoordAndDir():void {}
    
    private _energy:number;
    private _speed:number;
    private _direction:Coord;
    private _pos:Coord;
}


// класс для управления множеством осколков. Создает и хранит осколки, Задает их начальные значения, отрисовывает и т.д.
class BulletFragments
{
    constructor(pos:Coord,energy:number)
    {
        this._totalEnergy=energy/10;
        this._factory= new FragmentTypeFactory();
        this._fragmets= new Array();
        let percentLarge=Math.floor(Math.random()*(50-30+1))+30;
        let percentMedium=Math.floor((100-percentLarge)*Math.random());
        let percentSmall=100-percentLarge-percentMedium;

        let name:string="largeSizeFragment";
        this.fillWithType(name,SizeOfFragment.LARGE,percentLarge,3,pos);
        name="mediumSizeFragment";
        this.fillWithType(name,SizeOfFragment.MEDIUM,percentMedium,2,pos);
        name="smallSizeFragment";
        this.fillWithType(name,SizeOfFragment.SMALL,percentSmall,1,pos);
    }
    
    draw():void
    {
        for (let fragment of this._fragmets)
            fragment.draw();
    }
    move():void
    {
        for (let fragment of this._fragmets)
            fragment.move();
    }
    private _totalEnergy: number;
    private _factory:FragmentTypeFactory;
    private readonly _enumSize=3;
    private _fragmets:Array<Fragment>;

    private getRandomEnum():number
    {
        return Math.floor(Math.random()*this._enumSize);
    }
    private getRandomDir():Coord
    {
        return new Coord(Math.random(),Math.random(),Math.random());
    }
    // функция создает множетсво осколько определенного размера
    private fillWithType(typeName:string,size:SizeOfFragment,percent:number,iter:number,begPos:Coord):void
    {
        
        let color:Color;
        let speed:number;
        let direction:Coord;
        let fragmentType= this._factory.getFragment(typeName,size);
        for (let i=0; i<percent; i+=iter)
        {
            color=this.getRandomEnum();
            speed=this._totalEnergy/100*iter;
            direction=this.getRandomDir();
            this._fragmets.push(new Fragment(fragmentType,color,begPos,direction,speed))
        }
    }
    

}

// Класс осколков. Хранит легковесную информацию: позицию, направление, скорость и ссылку на свой тип
class Fragment
{
    constructor(type:FragmentType,color:Color,
        pos:Coord,dir:Coord,speed:number)
    {
        this._type=type;
        this._speed=speed;
        this._color=color; 
        this._pos=Object.assign({},pos);  this._dir=Object.assign({},dir);
        console.log(`fragment of ${this._type.Name} created`);
    }
    move()
    {
        this._type.move(this._pos,this._dir);
    }
    draw()
    {
        this._type.draw(this._pos,this._color);
    }

    private _pos:Coord;
    private _color:Color;
    private _speed:number;
    private _dir:Coord;
    private _type:FragmentType;
}

// Класс типов осколков. Хранит тяжеловесный српайт, реализует методы отрисовки и движения
class FragmentType
{
    constructor(name:string,size:SizeOfFragment,spriteName:string)
    {
        this._name=name; this._sprite= new Sprite(spriteName);
        this._size=size;
        console.log("##################");
        console.log(`FragmentType of ${this._name} size created`);
        console.log("##################");
    }
    get Name():string
    {
        return this._name;
    }
    printProperties():void
    {}
    move(pos:Coord,dir:Coord):void
    {
        this.changeCoordAndDir(pos,dir);
    }
    draw(pos:Coord,color:Color)
    {
        this._sprite.drawSprite(pos,color);
    }

    private changeCoordAndDir(pos:Coord,dir:Coord):void{}

    private _name:string;
    private _size:SizeOfFragment;
    private _sprite:Sprite;
}

// Фабрика осколков. Создает новый тип осколков или возвращает уже существующий
class FragmentTypeFactory
{
    constructor()
    {
        this._cache=new Map();
    }
    getFragment(typeName:string,size:SizeOfFragment):FragmentType
    {
        if (this._cache.get(typeName)==(null || undefined))
        {
            let newFragmentType=new FragmentType(typeName,size,SizeOfFragment[size]);
            this._cache.set(typeName,newFragmentType);
            return newFragmentType;
        }
        else return this._cache.get(typeName) as FragmentType;
    }

    private _cache:Map<string,FragmentType>;
}




console.log("program started");
let bullet=new Bullet(new Coord,new Coord,100,1000);
let fragments=bullet.destruction();
fragments.draw();

