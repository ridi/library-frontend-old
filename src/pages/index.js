import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';

import Layout from '../components/Layout';
import { loadShows } from '../services/shows/actions';

const PostLink = ({ id, name }) => (
  <li>
    <Link as={`/p/${id}`} href={`/post?id=${id}`}>
      <a>{name}</a>
    </Link>
  </li>
);

class Index extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadShows());
  }

  render() {
    const { shows } = this.props;
    return (
      <Layout>
        <h1>Batman TV Shows</h1>
        <ul>
          {shows.map(({ show }) => (
            <PostLink id={show.id} name={show.name} />
          ))}
        </ul>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  shows: state.shows.shows,
});

export default connect(mapStateToProps)(Index);
