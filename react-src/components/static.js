import React from 'react';

class Static extends React.Component {

    render() {
        return (
            <div>
                <section className="jumbotron home text-center">
                    <div className="container brand-text">
                        <h1 className="jumbotron-heading">Some Static Content</h1>
                    </div>
                </section>

                <div className="container">
                    <div className="row">
                        <figure className="col-lg-4">
                            <img src="/images/ssr-static-image-server-side-rendering.jpg" alt="ssr server"/>
                        </figure>
                        <figure className="col-lg-4">
                            <img src="/images/server-side-render.jpg" alt="server side"/>
                        </figure>
                        <figure className="col-lg-4">
                            <img src="/images/golang-server-side-render.jpg" alt="golang server side rendering"/>
                        </figure>
                    </div>
                </div>
            </div>
        )
    }
}

export default Static
