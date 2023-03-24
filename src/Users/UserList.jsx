import React from 'react';


function UserList(props){

    return (
        <>
            <Card >
                <ul>
                    {
                        props.users.map(user => {
                            return <li key={user.id}>
                                {user.name}
                                {user.age} months old
                            </li> ;
                        })
                    }
                </ul>

            </Card>
        
        </>
    )
}