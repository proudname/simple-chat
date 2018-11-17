import React, { Component } from 'react';


export default class InputGroup extends Component {



    componentDidMount() {
        sessionStorage.activeUsers = { ...sessionStorage, das:'dsa' }
        sessionStorage.setItem('name', 'default');
    }


    render() {
        return (
            <div>
                {console.log(sessionStorage)};
            </div>
        );
    }

}