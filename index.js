"use strict";
// Класс, описывающий координаты в 3-х мерном пространстве
class Coord {
    constructor(xCoord = 0, yCoord = 0, zCoord = 0) {
        this._xCoord = xCoord;
        this._yCoord = yCoord;
        this._zCoord = zCoord;
    }
    get xCoord() {
        return this._xCoord;
    }
    get yCoord() {
        return this._yCoord;
    }
    get zCoord() {
        return this._zCoord;
    }
    plusCoord(xCoord = 0, yCoord = 0, zCoord = 0) {
        this._xCoord += xCoord;
        this._yCoord += yCoord;
        this._zCoord += zCoord;
    }
    clearCoord() {
        this._xCoord = 0;
        this._yCoord = 0;
        this._zCoord = 0;
    }
}
// Класс спрайтов. Предполагается, что спрайты занимают значительное место в памяти
class Sprite {
    constructor(name) {
        this._name = name;
    }
    drawSprite(pos, color) {
        console.log(`sprite ${this._name} with ${Color[color]} color rendered`);
    }
}
// перечисление возможных размеров оскольков
var SizeOfFragment;
(function (SizeOfFragment) {
    SizeOfFragment[SizeOfFragment["SMALL"] = 0] = "SMALL";
    SizeOfFragment[SizeOfFragment["MEDIUM"] = 1] = "MEDIUM";
    SizeOfFragment[SizeOfFragment["LARGE"] = 2] = "LARGE";
})(SizeOfFragment || (SizeOfFragment = {}));
// перечисление возможных цветов
var Color;
(function (Color) {
    Color[Color["RED"] = 0] = "RED";
    Color[Color["GREEN"] = 1] = "GREEN";
    Color[Color["BLUE"] = 2] = "BLUE";
})(Color || (Color = {}));
// Класс Пули. Разрушение пули создает множество осколков
class Bullet {
    constructor(pos, direction, speed, energy) {
        this._pos = Object.assign({}, pos);
        this._direction = Object.assign({}, direction);
        this._energy = energy;
        this._speed = speed;
    }
    move() {
        this.changeCoordAndDir();
        --this._energy;
    }
    destruction() {
        return new BulletFragments(this._pos, this._energy);
    }
    changeCoordAndDir() { }
}
// класс для управления множеством осколков. Создает и хранит осколки, Задает их начальные значения, отрисовывает и т.д.
class BulletFragments {
    constructor(pos, energy) {
        this._enumSize = 3;
        this._totalEnergy = energy / 10;
        this._factory = new FragmentTypeFactory();
        this._fragmets = new Array();
        let percentLarge = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
        let percentMedium = Math.floor((100 - percentLarge) * Math.random());
        let percentSmall = 100 - percentLarge - percentMedium;
        let name = "largeSizeFragment";
        this.fillWithType(name, SizeOfFragment.LARGE, percentLarge, 3, pos);
        name = "mediumSizeFragment";
        this.fillWithType(name, SizeOfFragment.MEDIUM, percentMedium, 2, pos);
        name = "smallSizeFragment";
        this.fillWithType(name, SizeOfFragment.SMALL, percentSmall, 1, pos);
    }
    draw() {
        for (let fragment of this._fragmets)
            fragment.draw();
    }
    move() {
        for (let fragment of this._fragmets)
            fragment.move();
    }
    getRandomEnum() {
        return Math.floor(Math.random() * this._enumSize);
    }
    getRandomDir() {
        return new Coord(Math.random(), Math.random(), Math.random());
    }
    // функция создает множетсво осколько определенного размера
    fillWithType(typeName, size, percent, iter, begPos) {
        let color;
        let speed;
        let direction;
        let fragmentType = this._factory.getFragment(typeName, size);
        for (let i = 0; i < percent; i += iter) {
            color = this.getRandomEnum();
            speed = this._totalEnergy / 100 * iter;
            direction = this.getRandomDir();
            this._fragmets.push(new Fragment(fragmentType, color, begPos, direction, speed));
        }
    }
}
// Класс осколков. Хранит легковесную информацию: позицию, направление, скорость и ссылку на свой тип
class Fragment {
    constructor(type, color, pos, dir, speed) {
        this._type = type;
        this._speed = speed;
        this._color = color;
        this._pos = Object.assign({}, pos);
        this._dir = Object.assign({}, dir);
        console.log(`fragment of ${this._type.Name} created`);
    }
    move() {
        this._type.move(this._pos, this._dir);
    }
    draw() {
        this._type.draw(this._pos, this._color);
    }
}
// Класс типов осколков. Хранит тяжеловесный српайт, реализует методы отрисовки и движения
class FragmentType {
    constructor(name, size, spriteName) {
        this._name = name;
        this._sprite = new Sprite(spriteName);
        this._size = size;
        console.log("##################");
        console.log(`FragmentType of ${this._name} size created`);
        console.log("##################");
    }
    get Name() {
        return this._name;
    }
    printProperties() { }
    move(pos, dir) {
        this.changeCoordAndDir(pos, dir);
    }
    draw(pos, color) {
        this._sprite.drawSprite(pos, color);
    }
    changeCoordAndDir(pos, dir) { }
}
// Фабрика осколков. Создает новый тип осколков или возвращает уже существующий
class FragmentTypeFactory {
    constructor() {
        this._cache = new Map();
    }
    getFragment(typeName, size) {
        if (this._cache.get(typeName) == (null || undefined)) {
            let newFragmentType = new FragmentType(typeName, size, SizeOfFragment[size]);
            this._cache.set(typeName, newFragmentType);
            return newFragmentType;
        }
        else
            return this._cache.get(typeName);
    }
}
console.log("program started");
let bullet = new Bullet(new Coord, new Coord, 100, 1000);
let fragments = bullet.destruction();
fragments.draw();
