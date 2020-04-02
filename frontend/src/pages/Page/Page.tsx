import React from 'react';

import { headerConnect } from '../../components/Header/connector';
import { Header } from '../../components/Header/Header';
import { Layout } from '../../components/Layout/Layout';

const HeaderContainer = headerConnect(Header);

export interface PageProps {

    session?: string;
}

export abstract class Page<P = {}, S = {}> extends React.Component<P & PageProps, S> {

    abstract renderContent(): React.ReactNode;

    render() {
        return (
            <div>
                <HeaderContainer />

                <Layout>
                    {this.renderContent()}
                </Layout>
            </div>
        );
    }
}
