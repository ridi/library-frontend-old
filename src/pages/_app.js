
import { Provider } from "react-redux";
import App, { Container } from "next/app";

import injectStore from '../store';


export default injectStore(class extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const {Component, pageProps, store} = this.props;
    return (
        <Container>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </Container>
    );
  }
});
