import React, { useState, useEffect, useCallback } from 'react'; 
import Button from '../UI/Button';
import Card from '../UI/Card';
import classes from './AddUser.module.css' ;
import ErrorModal from '../UI/ErrorModal' ;

const AddUser = () => {
    const [enteredName, setEnteredName] = useState("");
    const [enteredAge, setEnteredAge] = useState("");
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [errorModal, setErrorModal] = useState(null);
    const [myData, setMyData] = useState([])

    async function addUserHandler(event){
        event.preventDefault();

        let error = false;

        if (+enteredAge < 1){
            setErrorModal({
                title:"Błędnie podany wiek",
                msg:"Wiek musi być > 0"
            })
            error = true;
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(enteredEmail)){
            setErrorModal({
                title:"Błędnie podany email",
                msg:""
            })
            error = true;
        }

        if (enteredPassword == ""){
            setErrorModal({
                title:"Podaj hasło",
                msg:""
            })
            error = true;
        }

        setEnteredName('');
        setEnteredAge('');
        setEnteredEmail('');
        setEnteredPassword('');

        if (error) return;

        const res = await fetch("https://mogus-b2fd4-default-rtdb.firebaseio.com/users.json", {
            method: 'POST',
            body: JSON.stringify({
                "name": enteredName,
                "age": enteredAge,
                "email": enteredEmail,
                "password": enteredPassword
            }),

            headers:{
                'Content-Type': 'application.json'
            }
        });
    }

    const getDataHandler = useCallback(async () => {
        const res = await fetch('https://mogus-b2fd4-default-rtdb.firebaseio.com/users.json')
        const data = await res.json()
  
        const loadedData = []
        for(const key in data){
            loadedData.push({
                key: key,
                age: data[key].age,
                name: data[key].name,
                email: data[key].email,
                password: data[key].password
            })
        }

        setMyData(loadedData);
    })

    function errorHandler(event){
        setErrorModal(null)
    }

    useEffect(() => {
        getDataHandler()
    }, [getDataHandler])

    return(
        <>
            {errorModal && <ErrorModal title={errorModal.title} msg={errorModal.msg} onConfirm={errorHandler} />}
            <Card className={classes.input}>
                <form onSubmit={addUserHandler}>
                    <label htmlFor="username">UserName</label>
                    <input id="username"  type="text" required onChange={(e) => setEnteredName(e.target.value)} value={enteredName} />
                    <label htmlFor="age">Age (years)</label>
                    <input id="age" type="Number" required onChange={(e) => setEnteredAge(e.target.value)} value={enteredAge} />
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" required onChange={(e) => setEnteredEmail(e.target.value)} value={enteredEmail} />
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" required onChange={(e) => setEnteredPassword(e.target.value)} value={enteredPassword} />
                    <Button type="submit">Add</Button>
                </form>
                <ul>
                    {myData.map((item) => 
                    <li>
                        <h3>{item.key}</h3>
                        <p>Name: {item.name}</p>
                        <p>Email: {item.email}</p>
                        <p>Age: {item.age}</p>
                        <p>Password: {item.password}</p>
                    </li>
                    )}
                </ul>
            </Card>
        </>
    );
}

export default AddUser;