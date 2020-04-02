import React from 'react';
import { Button } from 'primereact/button';

import './Header.css';

export interface HeaderProps {

    locked: boolean;
    session?: string;

    onSignOut(): void;
}

export class Header extends React.Component<HeaderProps> {

    private onSignOut() {
        const { session, onSignOut } = this.props;

        if (session) {
            onSignOut();
        }
    }

    render() {
        const { locked, session } = this.props;

        return (
            <header className="main-header">
                <div className="logo">Lab-web-4<br/>Variant:5500</div>
                <div className="author">Aidar Sinetov P3213</div>
                {session && (
                    <div id="logout-button">
                        <Button label="Sign out" className="p-button-secondary" disabled={locked}
                                onClick={this.onSignOut.bind(this)} />
                    </div>
                )}
            </header>
        );
    }
}
