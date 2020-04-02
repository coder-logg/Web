import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { routes } from '../../routes';

import './App.css';

export interface AppProps {

    session?: string;

    checkSession(session: string): void;
}

export class App extends React.Component<AppProps> {

    componentDidMount(): void {
        const { session, checkSession } = this.props;

        if (session) {
            checkSession(session);
        }
    }

    render() {
        return (<Router>{routes}</Router>);
    }
}
