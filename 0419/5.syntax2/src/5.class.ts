// Class
// 객체를 만들기 위해서 사용한다.
// OOP
// class 안에서 대부분은 다 메서드이다.

// ex) User에 대한 클래스를 만든다.

//DTO :Data Transfer Object
class DUser {
    name: string
    age: number
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
}

//OOP
interface UserInfo {
    username: string
    userid: string
}

// 인터페이스를 이용한 방법
{
    interface IUser {
        addUser: (username: string, userid: string) => UserInfo
    }

    class User implements IUser {
        addUser(username: string, userid: string): UserInfo {
            return { username, userid }
        }
    }
}
// 추상클래스를 이용하여 바꾸면
{
    abstract class Person {
        abstract addUser(userid: string, username: string): UserInfo
    }

    class User2 extends Person {
        addUser(userid: string, username: string): UserInfo {
            throw { username, userid }
        }
    }
}

// 좋은 클래스를 만들려면 추상적으로 기능만 구현해놓은 클래스를 만들어야한다.
